import { Duration } from 'aws-cdk-lib';
import { Effect, ManagedPolicy, PolicyDocument, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Tracing } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LogGroup } from "aws-cdk-lib/aws-logs";
import { Construct } from 'constructs';
import type { Runtime } from 'aws-cdk-lib/aws-lambda';

export interface LambdaDeploymentProps {
  runtime: Runtime;
  server: string;
}

export class LambdaDeployment extends Construct {
  private readonly lambdaFunction: NodejsFunction;

  constructor(scope: Construct, id: string, props: LambdaDeploymentProps) {
    super(scope, id);

    const role = new Role(this, 'RemixServerRole', {
      description: 'Service Role for the Remix Server, managed by CDK',
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
      ]
    });

    // The Lambda function names have a hard limit on size of 64 characters.
    // We need to truncate the environment name to fit within that limit.
    const env = scope.node.tryGetContext('environmentName').replace(/[^a-zA-Z0-9-]/g, '-').substring(0, 50);

    // Define a consistent log group so that logs go to the same place when new versions are deployed.
    const logGroup = new LogGroup(this, "LogGroup", {
      logGroupName: `/aws/lambda/${env}-remix-server`,
    });

    this.lambdaFunction = new NodejsFunction(this, 'Default', {
      description: 'Remix Server, managed by CDK',
      runtime: props.runtime,
      entry: props.server,
      bundling: {
        nodeModules: ['@remix-run/architect', 'react', 'react-dom']
      },
      logGroup: logGroup,
      timeout: Duration.seconds(10),
      tracing: Tracing.ACTIVE,
      role: role,
    });
  }

  lambda() {
    return this.lambdaFunction;
  }
}
