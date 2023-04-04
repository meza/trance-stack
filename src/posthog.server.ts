import { PostHog } from 'posthog-node';

export const posthog = new PostHog(
  process.env.POSTHOG_TOKEN,
  {
    host: process.env.POSTHOG_API
  }
);

process.on('exit', async () => {
  await posthog.shutdownAsync();
});
