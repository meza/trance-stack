import path from 'node:path';
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
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { RemixApiGateway } from '../lib/Constructs/RemixApiGateway';
import { RemixDeployment } from '../lib/Constructs/RemixDeployment';
import type { StackProps } from 'aws-cdk-lib';
import type { AddBehaviorOptions } from 'aws-cdk-lib/aws-cloudfront';
import type { Construct } from 'constructs';

export class ProductionStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const environmentName = scope.node.tryGetContext('environmentName');
    const hostedZoneName = scope.node.tryGetContext('hostedZoneName');
    const domainName = scope.node.tryGetContext('domainName');
    const certificateArn = scope.node.tryGetContext('certificateArn');

    const certificate = Certificate.fromCertificateArn(this, 'Certificate', certificateArn);

    const formatName = (name: string) => `${id}-${environmentName}-${name}`;

    const remixDeployment = new RemixDeployment(this, formatName('RemixDeployment'), {
      publicDir: path.join(__dirname, '../../public'),
      server: path.join(__dirname, '../../server/index.js'),
      runtime: Runtime.NODEJS_18_X
    });

    const api = new RemixApiGateway(this, formatName('RemixApiGateway'), remixDeployment);

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

    const assetOrigin = new S3Origin(remixDeployment.staticBucket().bucket);
    const assetBehaviorOptions = {
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS
    };

    const distribution = new Distribution(this, 'HUHDistribution', {
      domainNames: [domainName],
      certificate: certificate,
      defaultBehavior: {
        compress: true,
        origin: new HttpOrigin(api.url()),
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
  }
}
