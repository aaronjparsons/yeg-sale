import * as Sentry from '@sentry/sveltekit';

// If you don't want to use Session Replay, remove the `Replay` integration,
// `replaysSessionSampleRate` and `replaysOnErrorSampleRate` options.
Sentry.init({
    dsn: import.meta.env.DEV ? undefined : "https://3c87af8382b182d299deab87784db8d6@o4505361360289792.ingest.us.sentry.io/4506855476756480",
    tracesSampleRate: 1,
    enableLogs: true
})

export const handleError = Sentry.handleErrorWithSentry();