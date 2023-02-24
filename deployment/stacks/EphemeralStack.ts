import path from 'node:path';
import { HttpApi } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { CfnOutput, Duration, Stack, Tags } from 'aws-cdk-lib';
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

export class EphemeralStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const environmentName = scope.node.tryGetContext('environmentName').replace(/[^a-zA-Z0-9-]/g, '-');
    const formatName = (name: string) => `${id}-${environmentName}-${name}`;

    const remixDeployment = new RemixDeployment(this, formatName('RemixDeployment'), {
      publicDir: path.join(__dirname, '../../public'),
      server: path.join(__dirname, '../../server/index.js'),
      runtime: Runtime.NODEJS_18_X
    });

    const api = new RemixApiGateway(this, formatName('RemixApiGateway'), remixDeployment);

    // eslint-disable-next-line no-new
    new CfnOutput(this, 'ApiUrl', {
      description: 'The URL of the API',
      value: api.url(),
      exportName: 'apiUrl'
    });

    Tags.of(this).add('ephemeral', 'true');
  }
}
