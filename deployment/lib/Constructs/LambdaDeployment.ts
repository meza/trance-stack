import { Duration } from 'aws-cdk-lib';
import { Effect, ManagedPolicy, PolicyDocument, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Tracing } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import type { Runtime } from 'aws-cdk-lib/aws-lambda';
import { RemixApiGateway } from './RemixApiGateway';

export interface LambdaDeploymentProps {
  runtime: Runtime;
  server: string;
}

export class LambdaDeployment extends Construct {
  private readonly lambdaFunction: NodejsFunction;
  constructor(scope: Construct, id: string, props: LambdaDeploymentProps) {
    super(scope, id);

    const allowLoggingPolicy = new PolicyStatement({
      sid: 'AllowRemixServerToCreateLogs',
      effect: Effect.ALLOW,
      actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents', 'logs:DescribeLogStreams'],
      resources: ['arn:aws:logs:*:*:*']
    });

    const role = new Role(this, 'RemixServerRole', {
      description: 'Service Role for the Remix Server, managed by CDK',
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
      ]
    });

    const logRetentionRole = new Role(this, 'RemixServerLogRetentionRole', {
      description: 'Log Retention Role for the Remix Server, managed by CDK',
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      inlinePolicies: {
        'AllowRemixServerToChangeLogRetention': new PolicyDocument({
          statements: [allowLoggingPolicy]
        })
      }
    });

    this.lambdaFunction = new NodejsFunction(this, 'RemixServer', {
      description: 'Remix Server, managed by CDK',
      runtime: props.runtime,
      entry: props.server,
      bundling: {
        nodeModules: ['@remix-run/architect', 'react', 'react-dom']
      },
      timeout: Duration.seconds(10),
      logRetention: RetentionDays.THREE_DAYS,
      tracing: Tracing.ACTIVE,
      role: role,
      logRetentionRole: logRetentionRole
    });

    this.lambdaFunction.addToRolePolicy(allowLoggingPolicy);
  }

  lambda() {
    return this.lambdaFunction;
  }
}
