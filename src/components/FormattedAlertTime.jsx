import React from "react";
import PropTypes from "prop-types";
import {
  alertTimeDisplayFormat,
  convertToLocalTime,
} from "../utilities/date_helper.js";

const FormattedAlertTime = ({ timeStamp }) => (
  <>{alertTimeDisplayFormat(convertToLocalTime(timeStamp))}</>
);

FormattedAlertTime.propTypes = {
  timeStamp: PropTypes.string.isRequired,
};
export default FormattedAlertTime;
