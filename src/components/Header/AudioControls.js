import React from "react";
import PropTypes from "prop-types";

const AudioControls = ({ onAudioChange, isAudioOn }) => (
  <>
    {isAudioOn ? (
      <span
        className="material-symbols-outlined"
        onClick={() => onAudioChange(false)}
        title="Alarm on"
      >
        volume_up
      </span>
    ) : (
      <span
        className="material-symbols-outlined"
        onClick={() => onAudioChange(true)}
        title="Alarm off"
      >
        volume_off
      </span>
    )}
  </>
);

AudioControls.propTypes = {
  onAudioChange: PropTypes.func.isRequired,
  isAudioOn: PropTypes.bool.isRequired,
};

export default AudioControls;
