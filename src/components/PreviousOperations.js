import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Row, Col } from "antd";
import Tile from "./Tile";
import Util from "../util";
import Tracking from "../tracking";
import { withTranslation } from "react-i18next";

const PreviousOperations = ({ t }) => {
  const ref = useRef();
  const isVisible = Util.useIsVisible(ref);

  useEffect(() => {
    if (isVisible) {
      Tracking.visibleEvent("previousOperations");
    }
  }, [isVisible]);

  return (
    <>
      <section ref={ref} className="section">
        <h2>{t("previous_operations.title")}</h2>
        <Row gutter={[24, 24]}>
          {Object.entries(t("previous_operations.operations", { returnObjects: true })).map(([key, operation]) => (
            <Col xs={24} sm={12} md={8} lg={6} key={key}>
              <Tile
                title={operation.title}
                subtitle={operation.subtitle}
                fromDate={new Date(operation.fromDate)}
                toDate={new Date(operation.toDate)}
                alertCount={operation.alert_count}
                isStatic
                showAverage
              />
            </Col>
          ))}
        </Row>
      </section>
    </>
  );
};

PreviousOperations.propTypes = {
  alertsClient: PropTypes.object.isRequired,
  showAverage: PropTypes.bool,
};
PreviousOperations.defaultProps = {
  showAverage: false,
};

export default withTranslation()(PreviousOperations);
