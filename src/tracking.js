/*
 A tracking module for Goole Analytics
*/

const Tracking = {
  alertModeOnEvent: () => window.gtag("event", "alert_mode_on"),
  alertLocationClick: (idx) =>
    window.gtag("event", "alert_location_click", {
      index: ++idx,
    }),
  userLocationMapLoadedEvent: () =>
    window.gtag("event", "user_location_map_loaded"),
  graphMonthClick: (month) =>
    window.gtag("event", "alert_by_day_graph_month_click", {
      month,
    }),
  alarmAudioClick: (isAudioOn) =>
    window.gtag("event", "alarm_audio_click", {
      isAudioOn,
    }),
  alarmPlayedEvent: () => window.gtag("event", "alarm_played"),

  // Twitter share
  shareHeaderClick: () =>
    window.gtag("event", "share_click", {
      method: "twitter_header",
    }),
  shareStickyHeaderClick: () =>
    window.gtag("event", "share_click", {
      method: "twitter_sticky_header",
    }),
  shareUserLocationMapClick: () =>
    window.gtag("event", "share_click", {
      method: "twitter_user_location_map",
    }),
  shareFooterClick: () =>
    window.gtag("event", "share_click", {
      method: "twitter_footer",
    }),
};

export default Tracking;
