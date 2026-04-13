import PropTypes from "prop-types";
import FadeIn from "../FadeIn";
import { Statistic, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const HeaderHero = ({
  alertSummaryTitle,
  alertSummaryText,
  alertSummaryCount,
  isLoading,
}) => (
  <>
    {isLoading ? (
      <Spin
        indicator={
          <LoadingOutlined style={{ fontSize: 36, color: "white" }} spin />
        }
      />
    ) : (
      <>
        {alertSummaryCount > 0 && (
          <FadeIn show={true}>
            <Statistic value={alertSummaryCount} />
          </FadeIn>
        )}
        <h3>{alertSummaryTitle}</h3>
        <div className="summary-text">{alertSummaryText}</div>
      </>
    )}
  </>
);

HeaderHero.propTypes = {
  alertSummaryTitle: PropTypes.string,
  alertSummaryText: PropTypes.string,
  alertSummaryCount: PropTypes.number,
  isLoading: PropTypes.bool.isRequired,
};
HeaderHero.defaultProps = {
  alertSummaryTitle: "",
  alertSummaryText: "",
  alertSummaryCount: 0,
};

export default HeaderHero;
