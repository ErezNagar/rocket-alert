import { Row, Col } from "antd";
import beeriDistance from "../beeri_distance.png";
import nahalOzDistance from "../nahal_oz_distance.png";
import ashkelonDistance from "../ashkelon_distance.png";
import jerusalemDistance from "../jerusalem_distance.png";
import telAvivDistance from "../tel_aviv_distance.png";

const DesktopView = () => (
  <div className="desktop">
    <Row
      gutter={[24, 24]}
      justify="space-around"
      align="middle"
      className="location-row"
    >
      <Col md={6}>
        <img
          src={nahalOzDistance}
          alt="Distance from Gaza strip to Nahal Oz"
          width="100%"
        ></img>
      </Col>
      <Col md={12}>
        <h2>1.5km (0.9 miles) to Nahal Oz</h2>
        <p className="location-description">A small community of 500 people</p>
        <div className="location-example">
          Less than the length of the Golden Gate Bridge
        </div>
      </Col>
    </Row>
    <Row
      gutter={[24, 24]}
      justify="space-around"
      align="middle"
      className="location-row"
    >
      <Col md={12}>
        <h2>4 km (2.5 miles) to Be'eri</h2>
        <p className="location-description">A small community of 1100 people</p>
        <div className="location-example">
          The length of the Washington DC National Mall
        </div>
      </Col>
      <Col md={6}>
        <img
          src={beeriDistance}
          alt="Distance from Gaza strip to Be'eri"
          width="100%"
        ></img>
      </Col>
    </Row>
    <Row
      gutter={[24, 24]}
      justify="space-around"
      align="middle"
      className="location-row"
    >
      <Col md={6}>
        <img
          src={ashkelonDistance}
          alt="Distance from Gaza strip to Ashkelon"
          width="100%"
        ></img>
      </Col>
      <Col md={12}>
        <h2>13 km (8 miles) to Ashkelon</h2>
        <p className="location-description">Population of 160k</p>
        <div className="location-example"></div>
      </Col>
    </Row>
    <Row
      gutter={[24, 24]}
      justify="space-around"
      align="middle"
      className="location-row"
    >
      <Col md={12}>
        <h2>70 km (44 miles) to Jerusalem</h2>
        <p className="location-description">Population of 980k (Metro: 1.3m)</p>
        <div className="location-example">The length of Lake Geneva</div>
      </Col>
      <Col md={6}>
        <img
          src={jerusalemDistance}
          alt="Distance from Gaza strip to Jerusalem"
          width="100%"
        ></img>
      </Col>
    </Row>
    <Row
      gutter={[24, 24]}
      justify="space-around"
      align="middle"
      className="location-row"
    >
      <Col md={6}>
        <img
          src={telAvivDistance}
          alt="Distance from Gaza strip to Tel Aviv"
          width="100%"
        ></img>
      </Col>
      <Col md={12}>
        <h2>62 km (39 miles) to Tel Aviv</h2>
        <p className="location-description">Population of 470k (Metro: 4.2m)</p>
        <div className="location-example">
          The distance between San Francisco and San Jose
        </div>
      </Col>
    </Row>
  </div>
);

const MobileView = () => (
  <div className="mobile">
    <Row
      gutter={[24, 24]}
      justify="space-around"
      align="middle"
      className="location-row"
    >
      <Col>
        <h2>1.5km (0.9 miles) to Nahal Oz</h2>
        <p className="location-description">A small community of 500 people</p>
        <img
          src={nahalOzDistance}
          alt="Distance from Gaza strip to nahal Oz"
          width="100%"
        ></img>
      </Col>
      <Col>
        <div className="location-example">
          Less than the length of the Golden Gate Bridge
        </div>
      </Col>
    </Row>
    <Row
      gutter={[24, 24]}
      justify="space-around"
      align="middle"
      className="location-row"
    >
      <Col>
        <h2>4 km (2.5 miles) to Be'eri</h2>
        <p className="location-description">A small community of 1100 people</p>
        <img
          src={beeriDistance}
          alt="Distance from Gaza strip to Be'eri"
          width="100%"
        ></img>
      </Col>
      <Col>
        <div className="location-example">
          The length of the Washington DC National Mall
        </div>
      </Col>
    </Row>
    <Row
      gutter={[24, 24]}
      justify="space-around"
      align="middle"
      className="location-row"
    >
      <Col>
        <h2>13 km (8 miles) to Ashkelon</h2>
        <p className="location-description">Population of 160k</p>
        <img
          src={ashkelonDistance}
          alt="Distance from Gaza strip to Ashkelon"
          width="100%"
        ></img>
      </Col>
    </Row>
    <Row
      gutter={[24, 24]}
      justify="space-around"
      align="middle"
      className="location-row"
    >
      <Col>
        <h2>70 km (44 miles) to Jerusalem</h2>
        <p className="location-description">Population of 980k (Metro: 1.3m)</p>
        <img
          src={jerusalemDistance}
          alt="Distance from Gaza strip to Jerusalem"
          width="100%"
        ></img>
      </Col>
      <Col>
        <div className="location-example">The length of Lake Geneva</div>
      </Col>
    </Row>
    <Row
      gutter={[24, 24]}
      justify="space-around"
      align="middle"
      className="location-row"
    >
      <Col>
        <h2>62 km (39 miles) to Tel Aviv</h2>
        <p className="location-description">Population of 470k (Metro: 4.2m)</p>
        <img
          src={telAvivDistance}
          alt="Distance from Gaza strip to Tel Aviv"
          width="100%"
        ></img>
      </Col>
      <Col>
        <div className="location-example">
          The distance between San Francisco and San Jose
        </div>
      </Col>
    </Row>
  </div>
);

const LocationDistance = () => (
  <section className="section location-distance">
    <div className="title">
      <h2>Terrorism is closer than you think</h2>
    </div>

    <div className="content">
      <DesktopView />
      <MobileView />
    </div>
  </section>
);

export default LocationDistance;
