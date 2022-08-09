import PropTypes from "prop-types";
import { Row, Col } from "antd";
import Tile from "./Tile";

const CurrentOperation = (props) => (
  <section className="section currentOperation">
    <Row gutter={[24, 24]} justify={"center"}>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Tile
          title={"Operation Breaking Dawn"}
          subtitle={"Aug 5 2022 - Aug 7 2022"}
          fromDate={new Date("2022-08-05T00:00")}
          toDate={new Date("2022-08-08T00:00")}
          alertsClient={props.alertsClient}
          showAverage
        />
      </Col>
    </Row>
  </section>
);

CurrentOperation.propTypes = {
  alertsClient: PropTypes.object.isRequired,
};
export default CurrentOperation;
