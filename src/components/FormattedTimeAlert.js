import React from "react";
import PropTypes from "prop-types";
import { parseISO, format } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";

const FormattedTimeAlert = ({ alert, toLocalTime = true }) => (
  <>
    {toLocalTime
      ? format(zonedTimeToUtc(alert.timeStamp, "Asia/Jerusalem"), "HH:mm")
      : format(parseISO(alert.timeStamp), "HH:mm")}
  </>
);

FormattedTimeAlert.propTypes = {
  alert: PropTypes.object.isRequired,
};
export default FormattedTimeAlert;
