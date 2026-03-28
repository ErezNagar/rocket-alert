import Utilities from "./utilities/utilities";

const RealTimeAlertManager = {
  eventSource: null,
  interval: null,
  alertQueue: [],
  alertClient: null,
  callback: null,
  retryDelay: 1000,

  /*
   *  Connects to the real-time alert source and listens for incoming alerts
   *  @param {object}   alertClient     The alert client
   *  @param {func}     callback         Callback function to process incoming alerts
   */
  startRealTimeAlerts: (alertClient, callback) => {
    if (RealTimeAlertManager.eventSource) {
      RealTimeAlertManager.eventSource.close();
    }
    RealTimeAlertManager.callback = callback;
    RealTimeAlertManager.alertClient = alertClient;
    RealTimeAlertManager.eventSource =
      RealTimeAlertManager.alertClient.getRealTimeAlertEventSource();

    RealTimeAlertManager.eventSource.onopen = () => {
      RealTimeAlertManager.processAlert(callback);
      RealTimeAlertManager.retryDelay = 1000;
    };

    RealTimeAlertManager.eventSource.addEventListener("message", (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.alerts?.[0]?.name === "KEEP_ALIVE") {
          return;
        }

        const alertData = data.alerts.filter(
          (alert) =>
            alert.alertTypeId === Utilities.ALERT_TYPE_ROCKETS ||
            alert.alertTypeId === Utilities.ALERT_TYPE_UAV,
        );
        if (alertData.length === 0) {
          return;
        }
        RealTimeAlertManager.alertQueue = [
          ...RealTimeAlertManager.alertQueue,
          ...alertData,
        ];
      } catch (e) {
        console.error("Failed to parse SSE message", e.data);
      }
    });

    RealTimeAlertManager.eventSource.onerror = () => {
      RealTimeAlertManager.eventSource.close();
      setTimeout(() => {
        const newDelay = Math.min(RealTimeAlertManager.retryDelay * 2, 10000);
        RealTimeAlertManager.retryDelay = newDelay;
        RealTimeAlertManager.startRealTimeAlerts(
          RealTimeAlertManager.alertClient,
          RealTimeAlertManager.callback,
        );
      }, RealTimeAlertManager.retryDelay);
    };
  },

  /*
   * Pulls real-time alerts from the queue in intervals of Utilities.REAL_TIME_ALERT_THROTTLE_DURATION ms,
   * until there are no more alerts left in the queue
   *  @param {func} cb  Callback function to process the alerts
   */
  processAlert: (cb) => {
    // Set an interval only once
    if (RealTimeAlertManager.interval) {
      return;
    }
    RealTimeAlertManager.interval = setInterval(() => {
      if (RealTimeAlertManager.alertQueue.length > 0) {
        let alerts;
        // Process alerts in batches if there are too many
        if (RealTimeAlertManager.alertQueue.length > 10) {
          alerts = RealTimeAlertManager.alertQueue.splice(0, 20);
        } else {
          alerts = [RealTimeAlertManager.alertQueue.shift()];
        }
        const isLastAlert = RealTimeAlertManager.alertQueue.length === 0;
        cb(alerts, isLastAlert);
      }
    }, Utilities.REAL_TIME_ALERT_THROTTLE_DURATION);
  },

  /*
   * Closes the real-time alert source
   */
  stopRealTimeAlerts: () => {
    if (RealTimeAlertManager.eventSource) {
      RealTimeAlertManager.eventSource.close();
      clearInterval(RealTimeAlertManager.interval);
      RealTimeAlertManager.interval = null;
    }
  },
};

export default RealTimeAlertManager;
