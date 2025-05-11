import React from 'react';
import PongStyle from '../PongStyle';

interface CountdownProps {
  countdown: number;
}

export const Countdown: React.FC<CountdownProps> = ({ countdown }) => {
  if (countdown <= 0) return null;

  return (
    <div className={PongStyle.overlay}>
      <h1>{countdown}</h1>
    </div>
  );
};

export default Countdown;
