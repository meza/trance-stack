import { Duration } from 'aws-cdk-lib';
import {
  AllowedMethods,
  CacheCookieBehavior,
  CacheHeaderBehavior,
  CachePolicy,
  CacheQueryStringBehavior,
  Distribution,
  OriginRequestCookieBehavior,
  OriginRequestHeaderBehavior,
  OriginRequestPolicy,
  OriginRequestQueryStringBehavior,
  PriceClass,
  ViewerProtocolPolicy
} from 'aws-cdk-lib/aws-cloudfront';
import { HttpOrigin, S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Construct } from 'constructs';
import type { RemixApiGateway } from './RemixApiGateway';
import type { RemixDeployment } from './RemixDeployment';
import type { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import type { AddBehaviorOptions } from 'aws-cdk-lib/aws-cloudfront';

export interface RemixCDNProps {
  remixDeployment: RemixDeployment;
  api: RemixApiGateway
  certificate?: ICertificate;
  domainNames?: string[];
}

export class RemixCDN extends Construct {
  private readonly cloudFrontDistribution: Distribution;
  constructor(scope: Construct, id: string, props: RemixCDNProps) {
    super(scope, id);

    const assetOrigin = new S3Origin(props.remixDeployment.staticBucket().bucket);

    const originRequestPolicy = new OriginRequestPolicy(this, 'RequestHandlerPolicy', {
      queryStringBehavior: OriginRequestQueryStringBehavior.all(),
      cookieBehavior: OriginRequestCookieBehavior.all(),
      // https://stackoverflow.com/questions/65243953/pass-query-params-from-cloudfront-to-api-gateway
      headerBehavior: OriginRequestHeaderBehavior.allowList(
        'Accept-Charset', 'Origin', 'Access-Control-Request-Method', 'Access-Control-Request-Headers', 'Referer', 'Accept-Language', 'Accept-Datetime'
      )
    });

    const cachePolicy = new CachePolicy(this, 'CachePolicy', {
      defaultTtl: Duration.seconds(0),
      minTtl: Duration.seconds(0),
      maxTtl: Duration.seconds(0),
      cookieBehavior: CacheCookieBehavior.none(),
      headerBehavior: CacheHeaderBehavior.none(),
      queryStringBehavior: CacheQueryStringBehavior.none()
    });

    const assetsCachePolicy = new CachePolicy(this, 'AssetsCachePolicy', {
      defaultTtl: Duration.seconds(86400),
      minTtl: Duration.seconds(1),
      maxTtl: Duration.seconds(31536000),
      cookieBehavior: CacheCookieBehavior.none(),
      headerBehavior: CacheHeaderBehavior.none(),
      queryStringBehavior: CacheQueryStringBehavior.allowList('v')
    });

    const requestHandlerBehavior: AddBehaviorOptions = {
      allowedMethods: AllowedMethods.ALLOW_ALL,
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      cachePolicy: cachePolicy,
      originRequestPolicy: originRequestPolicy
    };

    const assetBehaviorOptions = {
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      cachePolicy: assetsCachePolicy
    };

    this.cloudFrontDistribution = new Distribution(this, 'HUHDistribution', {
      domainNames: props.domainNames,
      certificate: props.certificate,
      defaultBehavior: {
        compress: true,
        origin: new HttpOrigin(props.api.url()),
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
  }

  public distribution(): Distribution {
    return this.cloudFrontDistribution;
  }
}
