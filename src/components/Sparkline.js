import React from "react";
import PropTypes from "prop-types";

const Sparkline = ({ id, width, height, data }) => {
  id = id.replaceAll(" ", "_").toLowerCase();
  const max = Math.max(...data);
  const scopedData = data.map((val) => Math.round((val / max) * height));
  const points = [];
  scopedData.forEach((val, idx) => {
    const interval = width / scopedData.length;
    const xPos = Math.trunc(interval * idx);
    points.push([xPos, val]);
  });

  return (
    <svg width={width} height={height+1}>
      <defs>
        <linearGradient id={`gradient_${id}`} x1="0" x2="0" y1="1" y2="0">
          <stop offset="0%" stopColor="#5c0011"></stop>
          <stop offset="70%" stopColor="#f5222d"></stop>
        </linearGradient>
        <mask id={`mask_${id}`} x="0" y="0" width={width} height={height}>
          <polyline
            transform={`translate(10, ${height}) scale(1,-1)`}
            points={points.join(" ")}
            fill="transparent"
            stroke="#8cc665"
            strokeWidth="2"
          ></polyline>
        </mask>
      </defs>

      <g>
        <rect
          width={width}
          height={height+1}
          style={{
            fill: `url(#gradient_${id})`,
            mask: `url(#mask_${id}`,
          }}
        ></rect>
      </g>
    </svg>
  );
};

Sparkline.propTypes = {
  id: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
};

export default Sparkline;
