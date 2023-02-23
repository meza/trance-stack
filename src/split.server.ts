import path from 'node:path';
import { SplitFactory } from '@splitsoftware/splitio/server';

// eslint-disable-next-line new-cap
const splitFactory = SplitFactory({
  core: {
    authorizationKey: process.env.SPLIT_SERVER_TOKEN
  },
  debug: process.env.SPLIT_DEBUG === 'true',
  features: path.resolve(__dirname, '../devFeatures.yml')
});
const splitClient = splitFactory.client();

export default splitClient;
