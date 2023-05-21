import PropTypes from "prop-types";
import { Row, Col } from "antd";
import Tile from "./Tile";

const PreviousOperations = (props) => (
  <>
    <section className="section">
      <h2>Rocket alerts in previous conflicts</h2>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Tile
            title={"Operation Shield and Arrow"}
            subtitle={"May 9 2023 - May 13 2023"}
            fromDate={new Date("2023-05-09T00:00")}
            toDate={new Date("2023-05-13T00:00")}
            alertsClient={props.alertsClient}
            showAverage
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Tile
            title={"Operation Breaking Dawn"}
            subtitle={"Aug 5 2022 - Aug 7 2022"}
            fromDate={new Date("2022-08-05T00:00")}
            toDate={new Date("2022-08-07T00:00")}
            alertsClient={props.alertsClient}
            showAverage
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Tile
            title={"Operation Guardian of the Walls"}
            subtitle={"May 10, 2021 - May 21, 2021"}
            fromDate={new Date("2021-05-10")}
            toDate={new Date("2021-05-21")}
            alertsClient={props.alertsClient}
            showAverage
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Tile
            title={"Operation Black Belt"}
            subtitle={"Nov 12, 2019 - Nov 16, 2019"}
            fromDate={new Date("2019-11-12")}
            toDate={new Date("2019-11-16")}
            alertsClient={props.alertsClient}
            showAverage
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Tile
            title={"Operation Protective Edge"}
            subtitle={"July 8, 2014 - Aug 26, 2014"}
            fromDate={new Date("2014-07-08")}
            toDate={new Date("2014-08-26")}
            alertsClient={props.alertsClient}
            showAverage
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Tile
            title={"Operation Pillar of Defense"}
            subtitle={"Nov 14, 2012 - Nov 21, 2012"}
            fromDate={new Date("2012-11-14")}
            toDate={new Date("2012-11-21")}
            alertCount={1506}
            isStatic
            showAverage
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Tile
            title={"Operation Cast Lead"}
            subtitle={"Dec 27, 2008 - Jan 18, 2009"}
            fromDate={new Date("2008-12-27")}
            toDate={new Date("2009-01-18")}
            alertCount={575}
            isStatic
            showAverage
          />
        </Col>
      </Row>
    </section>
    <section className="section">
      <h2>Rocket alerts in previous years</h2>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Tile
            title={"2022"}
            fromDate={new Date("2022-01-01")}
            alertsClient={props.alertsClient}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Tile
            title={"2021"}
            fromDate={new Date("2021-01-01")}
            toDate={new Date("2021-12-31")}
            alertsClient={props.alertsClient}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Tile
            title={"2020"}
            fromDate={new Date("2020-01-01")}
            toDate={new Date("2020-12-31")}
            alertsClient={props.alertsClient}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Tile
            title={"2019"}
            fromDate={new Date("2019-01-01")}
            toDate={new Date("2019-12-31")}
            alertsClient={props.alertsClient}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Tile
            title={"2018"}
            fromDate={new Date("2018-01-01")}
            toDate={new Date("2018-12-31")}
            alertsClient={props.alertsClient}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Tile
            title={"2017"}
            fromDate={new Date("2017-01-01")}
            toDate={new Date("2017-12-31")}
            alertsClient={props.alertsClient}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Tile
            title={"2016"}
            fromDate={new Date("2016-01-01")}
            toDate={new Date("2016-12-31")}
            alertsClient={props.alertsClient}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Tile
            title={"2015"}
            fromDate={new Date("2015-01-01")}
            toDate={new Date("2015-12-31")}
            alertsClient={props.alertsClient}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Tile
            title={"2014"}
            fromDate={new Date("2014-01-01")}
            toDate={new Date("2014-12-31")}
            alertsClient={props.alertsClient}
          />
        </Col>
      </Row>
    </section>
  </>
);

PreviousOperations.propTypes = {
  alertsClient: PropTypes.object.isRequired,
  showAverage: PropTypes.bool,
};
PreviousOperations.defaultProps = {
  showAverage: false,
};
export default PreviousOperations;
