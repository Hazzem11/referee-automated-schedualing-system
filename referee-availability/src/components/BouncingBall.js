import React, { useState, useCallback, useId } from "react";
import "./BouncingBall.css";

const BasketballSvg = ({ gradientId }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <radialGradient id={`${gradientId}-base`} cx="0.38" cy="0.32" r="0.62">
        <stop offset="0%" stopColor="#ffb347" />
        <stop offset="45%" stopColor="#e8621a" />
        <stop offset="100%" stopColor="#b84a0e" />
      </radialGradient>
      <radialGradient id={`${gradientId}-shine`} cx="0.32" cy="0.26" r="0.45">
        <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
      </radialGradient>
      <clipPath id={`${gradientId}-clip`}>
        <circle cx="32" cy="32" r="30" />
      </clipPath>
    </defs>
    <circle cx="32" cy="32" r="30" fill={`url(#${gradientId}-base)`} />
    {/*
      NBA / Spalding seam layout (front view):
      - one equator seam across the middle
      - two curved seams from pole to pole, bowing left and right
    */}
    <g
      clipPath={`url(#${gradientId}-clip)`}
      stroke="#1a1a1a"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 32 H62" />
      <path d="M32 3 C17 12 17 52 32 61" />
      <path d="M32 3 C47 12 47 52 32 61" />
    </g>
    <circle cx="32" cy="32" r="30" fill={`url(#${gradientId}-shine)`} />
    <circle cx="32" cy="32" r="30" stroke="#000000" strokeWidth="2.5" fill="none" />
  </svg>
);

const BOUNCE_MS = 520;

const BouncingBall = ({ size = 28, variant = "floating" }) => {
  const [bouncing, setBouncing] = useState(false);
  const gradientId = useId().replace(/:/g, "");

  const handleClick = useCallback(() => {
    if (bouncing) return;
    setBouncing(true);
    window.setTimeout(() => setBouncing(false), BOUNCE_MS);
  }, [bouncing]);

  return (
    <div
      className={`bouncing-ball-wrap bouncing-ball-wrap--${variant}`}
      style={{ "--ball-size": `${size}px` }}
    >
      <div className="bouncing-ball-stage">
        <button
          type="button"
          className={`bouncing-ball ${bouncing ? "bouncing" : ""}`}
          onClick={handleClick}
          aria-label="Click to dribble the basketball"
          title="Click to dribble!"
        >
          <BasketballSvg gradientId={gradientId} />
        </button>
      </div>
      <div className="bouncing-ball-shadow" aria-hidden="true" />
    </div>
  );
};

export default BouncingBall;
