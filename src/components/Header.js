import PropTypes from "prop-types";
import Tile from "./Tile";
import { TwitterOutlined } from "@ant-design/icons";
import logo from "../logo.svg";

const Header = (props) => (
  <header className="header">
    <div className="top">
      <img className="logo" src={logo} alt="" />
      <h2>Real-time rocket alerts in Israel</h2>
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
  getYesterday() {},
  alertClient: PropTypes.object.isRequired,
};

Header.defaultProps = {
  getYesterday: () => {},
};

export default Header;
