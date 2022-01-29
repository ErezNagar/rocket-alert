import Util from "./util";

// Display time + total transition time;
const THROTTLE = 3000;

/* Keep max of 30 most recent alerts.
 * In case of a single, relatively short barrage, this will most likely capture all or most of the alerts.
 * In case of multiple, long barrages, we'll onnly keep the MAX_QUEUE_SIZE most recent alerts,
 * which will allow us THROTTLE * MAX_QUEUE_SIZE = 90 seconds to show all alerts
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
      if (Util.isDev()) {
        console.log("Connection to server opened");
      }
      RealTimeAlertManager.processAlert(cb);
    };
    RealTimeAlertManager.alertEventSource.addEventListener("message", (e) => {
      if (Util.isDev()) {
        console.log("Incoming alert: ", e.data);
      }
      if (RealTimeAlertManager.alertQueue.length === MAX_QUEUE_SIZE) {
        RealTimeAlertManager.alertQueue.shift();
      }
      RealTimeAlertManager.alertQueue.push(e.data);
    });
    RealTimeAlertManager.alertEventSource.onerror = () => {
      if (Util.isDev()) {
        console.log("EventSource failed.");
      }
    };
  },

  /*
   * Processes an alert from the queue in intervals of THROTTLE ms,
   * until there are no more alerts left in the queue
   *  @param {func} cb  Callback function to process incoming alerts
   */
  processAlert: (cb) => {
    RealTimeAlertManager.alertInterval = setInterval(() => {
      if (RealTimeAlertManager.alertQueue.length > 0) {
        cb(RealTimeAlertManager.alertQueue.shift());
      }
    }, THROTTLE);
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
