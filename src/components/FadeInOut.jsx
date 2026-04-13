import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const FadeInOut = ({ show, children }) => {
  const [render, setRender] = useState(show);

  useEffect(() => {
    if (show) setRender(true);
  }, [show]);

  const onAnimationEnd = () => {
    if (!show) setRender(false);
  };

  const getStyle = () => (show ? `fadeIn 400ms` : `fadeOut 400ms`);

  return (
    render && (
      <div style={{ animation: getStyle() }} onAnimationEnd={onAnimationEnd}>
        {children}
      </div>
    )
  );
};

FadeInOut.propTypes = {
  show: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default FadeInOut;
