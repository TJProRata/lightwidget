import React from 'react';
import gistAnswersLogo from '../../../assets/logo_GistAnswers 1.png';

export const PoweredByLogo = ({ className = '' }) => {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '3px'
      }}
    >
      <span
        style={{
          color: 'rgba(255, 255, 255, 0.35)',
          fontSize: '8px',
          fontWeight: '400',
          letterSpacing: '0.1px'
        }}
      >
        Powered by
      </span>
      <img
        src={gistAnswersLogo}
        alt="GistAnswers"
        style={{
          height: '10px',
          width: 'auto',
          objectFit: 'contain'
        }}
        loading="eager"
        draggable={false}
      />
    </div>
  );
};