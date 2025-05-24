/*
 A tracking module for Goole Analytics
*/
import Utilities from "./utilities/utilities";

const track = (type, name, options) => {
  if (Utilities.isDev()) {
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
  graphYearClick: (year) =>
    track("event", "alert_by_day_graph_year_click", {
      year,
    }),
  graphMonthClick: (month) =>
    track("event", "alert_by_day_graph_month_click", {
      month,
    }),
  alarmAudioClick: (isAudioOn) =>
    track("event", "alarm_audio_click", {
      isAudioOn,
    }),
  alarmPlayedEvent: () => track("event", "alarm_played"),
  visibleEvent: (section) => track("event", "visible", { section }),

  // Twitter share
  shareHeaderClick: () =>
    track("event", "share_click", {
      method: "twitter_header",
    }),
  shareStickyHeaderClick: () =>
    track("event", "share_click", {
      method: "twitter_sticky_header",
    }),
  shareTimetoShelterClick: () =>
    track("event", "share_click", {
      method: "twitter_time_to_shelter",
    }),

  // Footer social
  socialFooterClick: (method) =>
    track("event", "footer_social", {
      method,
    }),

  // FAQ
  FAQClick: (idx) =>
    track("event", "faq_click", {
      index: idx,
    }),

  // Cache hit/miss for polygons.json
  polygonCache: (method) =>
    track("event", "polygons.json_cache", {
      method,
    }),

  // Error
  headerDataError: (err) =>
    track("event", "header_getHeaderData_error", {
      err,
    }),
  mostRecentAlertError: (err) =>
    track("event", "header_getMostRecentAlert_error", {
      err,
    }),
  detailedAlertsByDayError: (err) =>
    track("event", "currentOpeation_getDetailedAlertsByDay_error", {
      err,
    }),
  mostTargetedLocationsError: (err) =>
    track("event", "currentOpeation_getMostTargetedLocations_error", {
      err,
    }),
  mostTargetedRegionError: (err) =>
    track("event", "currentOpeation_GetMostTargetedRegions_error", {
      err,
    }),
  tileError: (err) =>
    track("event", "tile_getAlerts_error", {
      err,
    }),
};

export default Tracking;
