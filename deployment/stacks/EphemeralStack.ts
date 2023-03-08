import path from 'node:path';
import { CfnOutput, Stack, Tags } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { RemixApiGateway } from '../lib/Constructs/RemixApiGateway';
import { RemixDeployment } from '../lib/Constructs/RemixDeployment';
import type { StackProps } from 'aws-cdk-lib';
import type { Construct } from 'constructs';

export class EphemeralStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const environmentName = scope.node.tryGetContext('environmentName').replace(/[^a-zA-Z0-9-]/g, '-');
    const formatName = (name: string) => `${name}`;

    const remixDeployment = new RemixDeployment(this, formatName('RemixDeployment'), {
      publicDir: path.join(__dirname, '../../public'),
      server: path.join(__dirname, '../../server/index.js'),
      runtime: Runtime.NODEJS_18_X
    });

    const api = new RemixApiGateway(this, formatName('RemixApiGateway'), remixDeployment);

    remixDeployment.setApiUrl(`https://${api.url()}`);

    // eslint-disable-next-line no-new
    new CfnOutput(this, 'ApiUrl', {
      description: 'The URL of the API',
      value: api.url()
    });

    Tags.of(this).add('environment', environmentName);
    Tags.of(this).add('ephemeral', 'true');
  }
}
