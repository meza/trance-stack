#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Tags } from 'aws-cdk-lib';
import { name, version } from '../package.json';
import { EphemeralStack } from './stacks/EphemeralStack';
import { ProductionStack } from './stacks/ProductionStack';

const app = new cdk.App();
const envName = app.node.tryGetContext('environmentName').replace(/[^a-zA-Z0-9-]/g, '-');

// eslint-disable-next-line no-new
new ProductionStack(app, `${name}-production`, {
  description: `CDK Stack for ${name}, version: ${version}`,
  stackName: `${name}-${envName}`,
  analyticsReporting: true,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1' // must be us-east-1 to allow Lambda@Edge
  }
});

// eslint-disable-next-line no-new
new EphemeralStack(app, `${name}-ephemeral`, {
  description: `Ephemeral CDK Stack for ${name}, version: ${version}`,
  stackName: `${name}-${envName}-ephemeral`,
  analyticsReporting: true,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1' // must be us-east-1 to allow Lambda@Edge
  }
});

Tags.of(app).add('project', name);
Tags.of(app).add('environment', envName);
Tags.of(app).add('remix', 'true');
