import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const MoveIn = ({ shouldShow, children }) => {
  const [render, setRender] = useState(shouldShow);

  useEffect(() => {
    if (shouldShow) setRender(true);
  }, [shouldShow]);

  const onAnimationEnd = () => {
    if (!shouldShow) setRender(false);
  };

  const getStyle = () => (shouldShow ? `moveIn 400ms` : "none");

  return (
    render && (
      <div style={{ animation: getStyle() }} onAnimationEnd={onAnimationEnd}>
        {children}
      </div>
    )
  );
};

MoveIn.propTypes = {
  shouldShow: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default MoveIn;
