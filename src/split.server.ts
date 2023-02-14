import { SplitFactory } from '@splitsoftware/splitio/server';

// eslint-disable-next-line new-cap
const splitFactory = SplitFactory({
  core: {
    authorizationKey: process.env.SPLIT_SERVER_TOKEN || 'localhost'
  },
  debug: process.env.NODE_ENV === 'development'
});
const splitClient = splitFactory.client();

export default splitClient;
