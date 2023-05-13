import Util from "./util";

/* Keep max of 30 most recent alerts.
 * In case of a single, relatively short barrage, this will most likely capture all or most of the alerts.
 * In case of multiple, long barrages, we'll only keep the MAX_QUEUE_SIZE most recent alerts,
 * which will allow us Util.REAL_TIME_ALERT_THROTTLE_DURATION * MAX_QUEUE_SIZE = 150 seconds to show all alerts, one after another
 */
const MAX_QUEUE_SIZE = 30;

const RealTimeAlertManager = {
  alertEventSource: null,
  alertInterval: null,
  alertQueue: [],

  /*
   *  Connects to the real-time alert source and listens for incoming alerts
   *  @param {object}   alertClient The alert client
   *  @param {func}     cb          Callback function to process incoming alerts
   */
  startRealTimeAlerts: (alertClient, cb) => {
    RealTimeAlertManager.alertEventSource =
      alertClient.getRealTimeAlertEventSource();
    RealTimeAlertManager.alertEventSource.onopen = () => {
      RealTimeAlertManager.processAlert(cb);
    };
    RealTimeAlertManager.alertEventSource.addEventListener("message", (e) => {
      if (RealTimeAlertManager.alertQueue.length === MAX_QUEUE_SIZE) {
        RealTimeAlertManager.alertQueue.shift();
      }
      RealTimeAlertManager.alertQueue.push(e.data);
    });
    RealTimeAlertManager.alertEventSource.onerror = () => {
      console.error("EventSource failed.");
    };
  },

  /*
   * Pulls real-time alerts from the queue in intervals of Util.REAL_TIME_ALERT_THROTTLE_DURATION ms,
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
        const alert = RealTimeAlertManager.alertQueue.shift();
        const isLastAlert = RealTimeAlertManager.alertQueue.length === 0;
        cb(alert, isLastAlert);
      }
    }, Util.REAL_TIME_ALERT_THROTTLE_DURATION);
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
