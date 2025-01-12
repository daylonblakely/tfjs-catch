import React from 'react';

const BasketballCourt = () => {
  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100vh', // Full height of the screen
        zIndex: -999,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 500 1000"
        style={{
          position: 'absolute',
        }}
      >
        {/* Half Court Line (Top) */}
        <line
          x1="-5000"
          y1="0"
          x2="5000" // Full width of the court
          y2="0"
          stroke="black"
          strokeWidth="10"
        />

        {/* Center Circle (Top) */}
        <circle
          cx="250" // Center horizontally
          cy="0" // At the top of the court
          r="200"
          stroke="black"
          strokeWidth="10"
          fill="none"
        />

        {/* Key (Centered Vertically) */}
        <rect
          x="125"
          y="750" // Adjusted for half-court
          width="250"
          height="250"
          stroke="black"
          strokeWidth="10"
          fill="none"
        />

        {/* Free Throw Circle */}
        <circle
          cx="250"
          cy="750" // Adjusted to match the key
          r="125"
          stroke="black"
          strokeWidth="10"
          fill="none"
        />

        {/* Baseline (Bottom) */}
        <line
          x1="-5000"
          y1="1000" // Bottom of the court
          x2="5000"
          y2="1000"
          stroke="black"
          strokeWidth="10"
        />

        {/* 3 point line */}
        <circle
          cx="250"
          cy="1000" // Adjusted to match the key
          r="375"
          stroke="black"
          strokeWidth="10"
          fill="none"
        />
      </svg>
    </div>
  );
};

export default BasketballCourt;
