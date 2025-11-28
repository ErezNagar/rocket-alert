import Utilities from "./utilities/utilities";

/* Keep max of 30 most recent alerts.
 * In case of a single, relatively short barrage, this will most likely capture all or most of the alerts.
 * In case of multiple, long barrages, we'll only keep the MAX_QUEUE_SIZE most recent alerts,
 * which will allow us Utilities.REAL_TIME_ALERT_THROTTLE_DURATION * MAX_QUEUE_SIZE seconds to show all alerts, one after another
 */
const MAX_QUEUE_SIZE = 30;

const RealTimeAlertManager = {
  alertEventSource: null,
  alertInterval: null,
  alertQueue: [],

  /*
   *  Connects to the real-time alert source and listens for incoming alerts
   *  @param {object}   alertClient     The alert client
   *  @param {func}     alertCB         Callback function to process incoming alerts
   */
  startRealTimeAlerts: (alertClient, alertCB) => {
    RealTimeAlertManager.alertEventSource =
      alertClient.getRealTimeAlertEventSource();

    RealTimeAlertManager.alertEventSource.onopen = () => {
      RealTimeAlertManager.processAlert(alertCB);
    };

    RealTimeAlertManager.alertEventSource.addEventListener("message", (e) => {
      const data = JSON.parse(e.data);
      if (data.alerts[0].name === "KEEP_ALIVE") {
        return;
      }

      const alertData = data.alerts.filter(
        (alert) =>
          alert.alertTypeId === Utilities.ALERT_TYPE_ROCKETS ||
          alert.alertTypeId === Utilities.ALERT_TYPE_UAV
      );
      if (alertData.length === 0) {
        return;
      }
      if (RealTimeAlertManager.alertQueue.length === MAX_QUEUE_SIZE) {
        RealTimeAlertManager.alertQueue.shift();
      }
      RealTimeAlertManager.alertQueue = [
        ...RealTimeAlertManager.alertQueue,
        ...data.alerts,
      ];
    });
    RealTimeAlertManager.alertEventSource.onerror = () => {
      console.error("EventSource failed.");
    };
  },

  /*
   * Pulls real-time alerts from the queue in intervals of Utilities.REAL_TIME_ALERT_THROTTLE_DURATION ms,
   * until there are no more alerts left in the queue
   *  @param {func} cb  Callback function to process the alerts
   */
  processAlert: (cb) => {
    // Set an interval only once
    if (RealTimeAlertManager.alertInterval) {
      return;
    }
    RealTimeAlertManager.alertInterval = setInterval(() => {
      if (RealTimeAlertManager.alertQueue.length > 0) {
        let alert;
        // Process alerts in batches if there are too many
        if (RealTimeAlertManager.alertQueue.length > 30) {
          alert = RealTimeAlertManager.alertQueue.splice(0, 10);
        } else {
          alert = RealTimeAlertManager.alertQueue.shift();
        }
        const isLastAlert = RealTimeAlertManager.alertQueue.length === 0;
        cb(alert, isLastAlert);
      }
    }, Utilities.REAL_TIME_ALERT_THROTTLE_DURATION);
  },

  /*
   * Closes the real-time alert source
   */
  stopRealTimeAlerts: () => {
    if (RealTimeAlertManager.alertEventSource) {
      RealTimeAlertManager.alertEventSource.close();
      clearInterval(RealTimeAlertManager.alertInterval);
    }
  },
};

export default RealTimeAlertManager;
