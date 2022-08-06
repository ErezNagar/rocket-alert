import React from "react";
import PropTypes from "prop-types";
import { parseISO, format } from "date-fns";

const FormattedTimeAlert = ({ alert }) => (
  <>{format(parseISO(alert.timeStamp), "HH:mm")} </>
);

FormattedTimeAlert.propTypes = {
  alert: PropTypes.object.isRequired,
};
export default FormattedTimeAlert;
