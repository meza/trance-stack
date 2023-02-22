#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { name } from '../package.json';
import { CdkStack } from './lib/cdkStack';

const app = new cdk.App();
// eslint-disable-next-line no-new
new CdkStack(app, name, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1' // must be us-east-1 to allow Lambda@Edge
  }

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});
