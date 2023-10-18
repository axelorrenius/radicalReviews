#!/usr/bin/env node
import 'source-map-support/register';
import { App} from '@aws-cdk/core'
import { ECSStack } from '../lib/ecs-stack';

const app = new App();
new ECSStack(app, 'InfrastructureStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  }
});