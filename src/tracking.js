/*
 A tracking module for Goole Analytics
*/
import Util from "./util";

const track = (type, name, options) => {
  if (Util.isDev) {
    return;
  }

  if (options) {
    window.gtag(type, name, { ...options });
  } else {
    window.gtag(type, name);
  }
};

const Tracking = {
  alertModeOnEvent: () => track("event", "alert_mode_on"),
  alertLocationClick: (idx) =>
    track("event", "alert_location_click", {
      index: ++idx,
    }),
  userLocationMapLoadedEvent: () => track("event", "user_location_map_loaded"),
  graphMonthClick: (month) =>
    track("event", "alert_by_day_graph_month_click", {
      month,
    }),
  alarmAudioClick: (isAudioOn) =>
    track("event", "alarm_audio_click", {
      isAudioOn,
    }),
  alarmPlayedEvent: () => track("event", "alarm_played"),

  // Twitter share
  shareHeaderClick: () =>
    track("event", "share_click", {
      method: "twitter_header",
    }),
  shareStickyHeaderClick: () =>
    track("event", "share_click", {
      method: "twitter_sticky_header",
    }),
  shareUserLocationMapClick: () =>
    track("event", "share_click", {
      method: "twitter_user_location_map",
    }),
  shareFooterClick: () =>
    track("event", "share_click", {
      method: "twitter_footer",
    }),
};

export default Tracking;
