import * as Sentry from '@sentry/sveltekit';

Sentry.init({
  dsn: import.meta.env.DEV ? undefined : 'https://3c87af8382b182d299deab87784db8d6@o4505361360289792.ingest.us.sentry.io/4506855476756480',

  tracesSampleRate: 1.0,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: import.meta.env.DEV,
});