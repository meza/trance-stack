import path from 'node:path';
import { CfnOutput, Stack, Tags } from 'aws-cdk-lib';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { RemixApiGateway } from '../lib/Constructs/RemixApiGateway';
import { RemixCDN } from '../lib/Constructs/RemixCDN';
import { RemixDeployment } from '../lib/Constructs/RemixDeployment';
import type { StackProps } from 'aws-cdk-lib';
import type { Construct } from 'constructs';

export class ProductionStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const hostedZoneName = scope.node.tryGetContext('hostedZoneName');
    const domainName = scope.node.tryGetContext('domainName');
    const certificateArn = scope.node.tryGetContext('certificateArn');
    const certificate = Certificate.fromCertificateArn(this, 'Certificate', certificateArn);

    const remixDeployment = new RemixDeployment(this, 'RemixDeployment', {
      publicDir: path.join(__dirname, '../../public'),
      server: path.join(__dirname, '../../server/index.js'),
      runtime: Runtime.NODEJS_18_X
    });

    const api = new RemixApiGateway(this, 'RemixApiGateway', remixDeployment);

    remixDeployment.setApiUrl(`https://${domainName}`);

    const cdn = new RemixCDN(this, 'RemixCDN', {
      remixDeployment: remixDeployment,
      api: api,
      certificate: certificate,
      domainNames: [domainName]
    });

    // eslint-disable-next-line no-new
    new ARecord(this, 'AliasRecord', {
      zone: HostedZone.fromLookup(this, 'HostedZone', {
        domainName: hostedZoneName
      }),
      recordName: domainName,
      target: RecordTarget.fromAlias(new CloudFrontTarget(cdn.distribution()))
    });

    // eslint-disable-next-line no-new
    new CfnOutput(this, 'domain', {
      description: 'The URL of the app',
      value: domainName
    });

    Tags.of(this).add('ephemeral', 'false');
    Tags.of(this).add('production', 'true');
  }
}
