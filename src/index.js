import * as Sentry from "@sentry/react";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

Sentry.init({
  dsn: "https://46a31ed8247cc2ff80a700a18a3b4b41@o4511108213637120.ingest.us.sentry.io/4511108215275520",
  environment: process.env.NODE_ENV,
  sendDefaultPii: true,
  enableLogs: true,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
    Sentry.consoleLoggingIntegration({ levels: ["log", "error"] }),
  ],
  // Tracing
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.2,
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/rocketalert\.live/],

  // Session Replay
  // Sets rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysSessionSampleRate: 0.1,
  // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  replaysOnErrorSampleRate: 1.0,
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root"),
);
