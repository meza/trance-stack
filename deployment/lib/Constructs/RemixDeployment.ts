import { Construct } from 'constructs';
import { LambdaDeployment } from './LambdaDeployment';
import { StaticDeployment } from './StaticDeployment';
import type { Runtime } from 'aws-cdk-lib/aws-lambda';

export interface RemixDeploymentProps {
  runtime: Runtime;
  server: string;
  publicDir: string;
  s3Bucket?: {
    keyPrefix: string;
  }
}

export class RemixDeployment extends Construct {
  private readonly staticDeployment: StaticDeployment;
  private readonly lambdaFunction: LambdaDeployment;

  constructor(scope: Construct, id: string, props: RemixDeploymentProps) {
    super(scope, id);
    this.staticDeployment = new StaticDeployment(this, 'RemixFiles', {
      publicDir: props.publicDir,
      keyPrefix: props.s3Bucket?.keyPrefix
    });

    this.lambdaFunction = new LambdaDeployment(this, 'RemixServer', {
      runtime: props.runtime,
      server: props.server
    });

    this.staticDeployment.grantAccessTo(this.lambdaFunction);
  }

  staticBucket() {
    return this.staticDeployment.bucket();
  }

  server() {
    return this.lambdaFunction.lambda();
  }

  setApiUrl(apiUrl: string) {
    this.lambdaFunction.lambda().addEnvironment('APP_DOMAIN', apiUrl);
  }
}
