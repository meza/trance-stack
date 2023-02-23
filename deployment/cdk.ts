#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { name, version } from '../package.json';
import { CdkStack } from './lib/cdkStack';

const app = new cdk.App();

const stack = new CdkStack(app, `${name}-deployment`, {
  description: `CDK Stack for ${name}, version: ${version}`,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1' // must be us-east-1 to allow Lambda@Edge
  }
});

console.log(stack.getUrl());
