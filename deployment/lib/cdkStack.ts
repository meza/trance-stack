import path from 'node:path';
import { HttpApi } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { Duration, Stack } from 'aws-cdk-lib';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import {
  AllowedMethods, CacheCookieBehavior, CacheHeaderBehavior,
  CachePolicy, CacheQueryStringBehavior,
  Distribution,
  OriginRequestCookieBehavior,
  OriginRequestHeaderBehavior,
  OriginRequestPolicy,
  OriginRequestQueryStringBehavior,
  PriceClass,
  ViewerProtocolPolicy
} from 'aws-cdk-lib/aws-cloudfront';
import { HttpOrigin, S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Runtime, Tracing } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, CacheControl, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { ParameterTier, StringParameter } from 'aws-cdk-lib/aws-ssm';
import type { StackProps } from 'aws-cdk-lib';
import type { AddBehaviorOptions } from 'aws-cdk-lib/aws-cloudfront';
import type { Construct } from 'constructs';

export class CdkStack extends Stack {
  readonly distributionUrlParameterName = '/remix/distribution/url';
  private finalUrl: string | null = null;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const environmentName = scope.node.tryGetContext('environmentName');
    const hostedZoneName = scope.node.tryGetContext('hostedZoneName');
    const domainName = scope.node.tryGetContext('domainName');
    const certificateArn = scope.node.tryGetContext('certificateArn');

    const certificate = Certificate.fromCertificateArn(this, 'Certificate', certificateArn);

    const formatName = (name: string) => `${id}-${environmentName}-${name}`;

    const bucket = new Bucket(this, formatName('AssetsBucket'));

    // eslint-disable-next-line no-new
    new BucketDeployment(this, formatName('DeployStaticAssets'), {
      sources: [Source.asset(path.join(__dirname, '../../public'))],
      destinationBucket: bucket,
      destinationKeyPrefix: '_static',
      cacheControl: [
        CacheControl.maxAge(Duration.days(365)),
        CacheControl.sMaxAge(Duration.days(365))
      ]
    });

    const fn = new NodejsFunction(this, formatName('RequestHandler'), {
      runtime: Runtime.NODEJS_18_X,
      entry: path.join(__dirname, '../../server/index.js'),
      bundling: {
        commandHooks: {
          beforeBundling: (inputDir: string, _: string) => {
            return [
              `cd ${inputDir}`,
              'pnpm install --no-frozen-lockfile'
            ];
          },
          beforeInstall: () => {
            return [];
          },
          afterBundling: () => {
            return [];
          }
        },
        nodeModules: ['@remix-run/architect', 'react', 'react-dom']
      },
      timeout: Duration.seconds(10),
      logRetention: RetentionDays.THREE_DAYS,
      tracing: Tracing.ACTIVE
    });

    const integration = new HttpLambdaIntegration(formatName('kHttpLambdaIntegration'), fn);

    const httpApi = new HttpApi(this, 'TranceStackApi', {
      defaultIntegration: integration
    });

    const httpApiUrl = `${httpApi.httpApiId}.execute-api.${Stack.of(this).region}.${Stack.of(this).urlSuffix}`;

    const originRequestPolicy = new OriginRequestPolicy(this, formatName('RequestHandlerPolicy'), {
      originRequestPolicyName: formatName('RequestHandlerPolicy'),
      queryStringBehavior: OriginRequestQueryStringBehavior.all(),
      cookieBehavior: OriginRequestCookieBehavior.all(),
      // https://stackoverflow.com/questions/65243953/pass-query-params-from-cloudfront-to-api-gateway
      headerBehavior: OriginRequestHeaderBehavior.allowList(
        'Accept-Charset', 'Origin', 'Access-Control-Request-Method', 'Access-Control-Request-Headers', 'Referer', 'Accept-Language', 'Accept-Datetime'
      )
    });

    const cachePolicy = new CachePolicy(this, formatName('CachePolicy'), {
      cachePolicyName: formatName('CachePolicy'),
      defaultTtl: Duration.seconds(86400),
      minTtl: Duration.seconds(0),
      maxTtl: Duration.seconds(31536000),
      cookieBehavior: CacheCookieBehavior.none(),
      headerBehavior: CacheHeaderBehavior.allowList('Origin', 'Access-Control-Request-Method', 'Access-Control-Request-Headers', 'Referer', 'Accept-Language', 'Accept-Datetime'),
      queryStringBehavior: CacheQueryStringBehavior.none()
    });
    const requestHandlerBehavior: AddBehaviorOptions = {
      allowedMethods: AllowedMethods.ALLOW_ALL,
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      cachePolicy: cachePolicy,
      originRequestPolicy: originRequestPolicy
    };

    const assetOrigin = new S3Origin(bucket);
    const assetBehaviorOptions = {
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS
    };

    const distribution = new Distribution(this, 'HUHDistribution', {
      domainNames: [domainName],
      certificate: certificate,
      defaultBehavior: {
        compress: true,
        origin: new HttpOrigin(httpApiUrl),
        ...requestHandlerBehavior
      },
      priceClass: PriceClass.PRICE_CLASS_ALL,
      additionalBehaviors: {
        '/_static/*': {
          origin: assetOrigin,
          ...assetBehaviorOptions
        }
      }
    });

    // eslint-disable-next-line no-new
    new ARecord(this, formatName('AliasRecord'), {
      zone: HostedZone.fromLookup(this, formatName('HostedZone'), {
        domainName: hostedZoneName
      }),
      recordName: domainName,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution))
    });

    // eslint-disable-next-line no-new
    new StringParameter(this, formatName('DistributionUrlParameter'), {
      parameterName: this.distributionUrlParameterName,
      stringValue: distribution.distributionDomainName,
      tier: ParameterTier.STANDARD
    });

  }

  getUrl(): string {
    if (!this.finalUrl) {
      const url = StringParameter.fromStringParameterName(this, 'ParamNameRequest', this.distributionUrlParameterName);
      this.finalUrl = `https://${url}`;
    }
    return this.finalUrl;
  }
}
