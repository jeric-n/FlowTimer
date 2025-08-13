import React from 'react';
import Timer from '../components/Timer';
import DayVisualization from '../components/DayVisualization';

const TimerPage = () => {
  return (
    <div>
      <Timer />
      <div className="mt-4">
        <DayVisualization />
      </div>
    </div>
  );
};

export default TimerPage;
