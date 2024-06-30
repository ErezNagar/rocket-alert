import React, { useEffect, useRef } from "react";
import { Row, Col } from "antd";
import { withTranslation } from "react-i18next";
import Util from "../util";
import beeriDistance from "../assets/beeri_distance.png";
import nahalOzDistance from "../assets/nahal_oz_distance.png";
import ashkelonDistance from "../assets/ashkelon_distance.png";
import jerusalemDistance from "../assets/jerusalem_distance.png";
import telAvivDistance from "../assets/tel_aviv_distance.png";
import Tracking from "../tracking";

const DesktopView = ({ t }) => (
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
          alt={t("location_distance.nahal_oz.alt")}
          width="100%"
        ></img>
      </Col>
      <Col md={12}>
        <h2>{t("location_distance.nahal_oz.distance")}</h2>
        <p className="location-description">{t("location_distance.nahal_oz.description")}</p>
        <div className="location-example">
          {t("location_distance.nahal_oz.example")}
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
        <h2>{t("location_distance.beeri.distance")}</h2>
        <p className="location-description">{t("location_distance.beeri.description")}</p>
        <div className="location-example">
          {t("location_distance.beeri.example")}
        </div>
      </Col>
      <Col md={6}>
        <img
          src={beeriDistance}
          alt={t("location_distance.beeri.alt")}
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
          alt={t("location_distance.ashkelon.alt")}
          width="100%"
        ></img>
      </Col>
      <Col md={12}>
        <h2>{t("location_distance.ashkelon.distance")}</h2>
        <p className="location-description">{t("location_distance.ashkelon.description")}</p>
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
        <h2>{t("location_distance.jerusalem.distance")}</h2>
        <p className="location-description">{t("location_distance.jerusalem.description")}</p>
        <div className="location-example">{t("location_distance.jerusalem.example")}</div>
      </Col>
      <Col md={6}>
        <img
          src={jerusalemDistance}
          alt={t("location_distance.jerusalem.alt")}
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
          alt={t("location_distance.tel_aviv.alt")}
          width="100%"
        ></img>
      </Col>
      <Col md={12}>
        <h2>{t("location_distance.tel_aviv.distance")}</h2>
        <p className="location-description">{t("location_distance.tel_aviv.description")}</p>
        <div className="location-example">
          {t("location_distance.tel_aviv.example")}
        </div>
      </Col>
    </Row>
  </div>
);

const MobileView = ({ t }) => (
  <div className="mobile">
    <Row
      gutter={[24, 24]}
      justify="space-around"
      align="middle"
      className="location-row"
    >
      <Col>
        <h2>{t("location_distance.nahal_oz.distance")}</h2>
        <p className="location-description">{t("location_distance.nahal_oz.description")}</p>
        <img
          src={nahalOzDistance}
          alt={t("location_distance.nahal_oz.alt")}
          width="100%"
        ></img>
      </Col>
      <Col>
        <div className="location-example">
          {t("location_distance.nahal_oz.example")}
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
        <h2>{t("location_distance.beeri.distance")}</h2>
        <p className="location-description">{t("location_distance.beeri.description")}</p>
        <img
          src={beeriDistance}
          alt={t("location_distance.beeri.alt")}
          width="100%"
        ></img>
      </Col>
      <Col>
        <div className="location-example">
          {t("location_distance.beeri.example")}
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
        <h2>{t("location_distance.ashkelon.distance")}</h2>
        <p className="location-description">{t("location_distance.ashkelon.description")}</p>
        <img
          src={ashkelonDistance}
          alt={t("location_distance.ashkelon.alt")}
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
        <h2>{t("location_distance.jerusalem.distance")}</h2>
        <p className="location-description">{t("location_distance.jerusalem.description")}</p>
        <img
          src={jerusalemDistance}
          alt={t("location_distance.jerusalem.alt")}
          width="100%"
        ></img>
      </Col>
      <Col>
        <div className="location-example">{t("location_distance.jerusalem.example")}</div>
      </Col>
    </Row>
    <Row
      gutter={[24, 24]}
      justify="space-around"
      align="middle"
      className="location-row"
    >
      <Col>
        <h2>{t("location_distance.tel_aviv.distance")}</h2>
        <p className="location-description">{t("location_distance.tel_aviv.description")}</p>
        <img
          src={telAvivDistance}
          alt={t("location_distance.tel_aviv.alt")}
          width="100%"
        ></img>
      </Col>
      <Col>
        <div className="location-example">
          {t("location_distance.tel_aviv.example")}
        </div>
      </Col>
    </Row>
  </div>
);

const LocationDistance = ({ t }) => {
  const ref = useRef();
  const isVisible = Util.useIsVisible(ref);

  useEffect(() => {
    if (isVisible) {
      Tracking.visibleEvent("locationDistance");
    }
  }, [isVisible]);

  return (
    <section ref={ref} className="section location-distance">
      <div className="title">
        <h2>{t("location_distance.title")}</h2>
      </div>

      <div className="content">
        <DesktopView t={t} />
        <MobileView t={t} />
      </div>
    </section>
  );
};

export default withTranslation()(LocationDistance);
