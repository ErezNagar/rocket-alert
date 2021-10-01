import PropTypes from "prop-types";
import Tile from "./Tile";
import { TwitterOutlined } from "@ant-design/icons";

const Header = (props) => (
  <header className="header">
    <div className="top">
      <h1>Rocket Alerts</h1>
      <h2>Real-time rocket alerts in Israel</h2>
      <h3>{props.randrandomStringom}</h3>
    </div>
    <Tile
      isHeroTile
      title={"alerts today"}
      subtitle={props.getYesterday()}
      fromDate={props.getYesterday()}
      alertsClient={props.alertClient}
    />
    <div className="share">
      <a
        href="https://twitter.com/intent/tweet?button_hashtag=RocketAlert&ref_src=twsrc%5Etfw"
        data-show-count="false"
        data-text="custom share text"
        data-url="https://dev.twitter.com/web/tweet-button"
        data-hashtags="example,demo"
        data-via="twitterdev"
        data-related="twitterapi,twitter"
      >
        <div>
          <TwitterOutlined style={{ fontSize: "24px", color: "white" }} />
        </div>
        <div>#RocketAlerts</div>
      </a>
    </div>
  </header>
);

Header.propTypes = {
  randomString: PropTypes.string,
  getYesterday() {},
  alertClient: PropTypes.object.isRequired,
};

Header.defaultProps = {
  randomString: "",
  getYesterday: () => {},
};

export default Header;
