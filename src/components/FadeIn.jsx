import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const FadeIn = ({ show, children }) => {
  const [render, setRender] = useState(show);

  useEffect(() => {
    if (show) setRender(true);
  }, [show]);

  const onAnimationEnd = () => {
    if (!show) setRender(false);
  };

  const getStyle = () => (show ? `fadeIn 400ms` : "none");

  return (
    render && (
      <div style={{ animation: getStyle() }} onAnimationEnd={onAnimationEnd}>
        {children}
      </div>
    )
  );
};

FadeIn.propTypes = {
  show: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default FadeIn;
