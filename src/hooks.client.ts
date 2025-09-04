// import { handleErrorWithSentry, replayIntegration } from "@sentry/sveltekit";
// import * as Sentry from '@sentry/sveltekit';

// Sentry.init({
//   dsn: import.meta.env.MODE !== 'development' ? 'https://3c87af8382b182d299deab87784db8d6@o4505361360289792.ingest.us.sentry.io/4506855476756480' : undefined,
//   tracesSampleRate: 1.0,

//   // This sets the sample rate to be 10%. You may want this to be 100% while
//   // in development and sample at a lower rate in production
//   replaysSessionSampleRate: 0.1,

//   // If the entire session is not sampled, use the below sample rate to sample
//   // sessions when an error occurs.
//   replaysOnErrorSampleRate: 1.0,

//   // If you don't want to use Session Replay, just remove the line below:
//   integrations: [replayIntegration()],
// });

// // If you have a custom error handler, pass it to `handleErrorWithSentry`
// export const handleError = handleErrorWithSentry();