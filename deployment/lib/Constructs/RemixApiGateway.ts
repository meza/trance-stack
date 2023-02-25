import { HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration, HttpUrlIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { Stack } from 'aws-cdk-lib';
import { PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import type { RemixDeployment } from './RemixDeployment';

export class RemixApiGateway extends Construct {
  private readonly apiUrl: string;
  constructor(scope: Construct, id: string, remixDeployment: RemixDeployment) {
    super(scope, id);
    const integration = new HttpLambdaIntegration('LambdaIntegration', remixDeployment.server());
    const bucket = remixDeployment.staticBucket().bucket;

    const executionRole = new Role(this, 'ExecutionRole', {
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com')
    });

    executionRole.addToPolicy(new PolicyStatement({
      actions: ['s3:Get'],
      resources: [bucket.bucketArn]
    }));

    const s3Integration = new HttpUrlIntegration(
      'S3Integration',
      `https://${bucket.bucketName}.s3.amazonaws.com/${remixDeployment.staticBucket().key}/{proxy}`,
      {
        method: HttpMethod.GET
      }
    );

    const httpApi = new HttpApi(this, 'TranceStackApi', {
      apiName: scope.node.id
    });

    httpApi.addRoutes({
      path: '/{proxy+}',
      methods: [HttpMethod.ANY],
      integration: integration
    });

    httpApi.addRoutes({
      path: '/_static/{proxy+}',
      methods: [HttpMethod.GET],
      integration: s3Integration
    });

    this.apiUrl = `${httpApi.httpApiId}.execute-api.${Stack.of(this).region}.${Stack.of(this).urlSuffix}`;

    remixDeployment.server().addPermission('AllowInvoke', {
      principal: new ServicePrincipal('apigateway.amazonaws.com'),
      sourceArn: `arn:aws:execute-api:${Stack.of(this).region}:${Stack.of(this).account}:${httpApi.apiId}/*/*/*`
    });

  }

  public url(): string {
    return this.apiUrl;
  }
}
