import React from 'react';
import { Session } from '../types/Session';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DayVisualizationProps {
  sessions: Session[];
}

interface ChartData {
  name: string; // e.g., "00:00 - 01:00"
  focus: number; // in minutes
  break: number; // in minutes
}

const DayVisualization: React.FC<DayVisualizationProps> = ({ sessions }) => {
  const processSessionsForChart = (sessions: Session[]): ChartData[] => {
    const dataMap = new Map<string, { focus: number; break: number }>();

    // Initialize dataMap for each hour of the day
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, '0');
      dataMap.set(`${hour}:00`, { focus: 0, break: 0 });
    }

    sessions.forEach(session => {
      session.focusPeriods.forEach(period => {
        const startTime = new Date(period.startTime);
        const endTime = new Date(period.endTime);
        const startHour = startTime.getHours();
        const endHour = endTime.getHours();

        // Distribute duration across hours if a period spans multiple hours
        if (startHour === endHour) {
          const hourKey = `${startHour.toString().padStart(2, '0')}:00`;
          const current = dataMap.get(hourKey) || { focus: 0, break: 0 };
          current.focus += period.duration / 60; // Convert seconds to minutes
          dataMap.set(hourKey, current);
        } else {
          // Handle periods spanning multiple hours
          let current = startTime;
          while (current < endTime) {
            const hourKey = `${current.getHours().toString().padStart(2, '0')}:00`;
            const nextHour = new Date(current);
            nextHour.setHours(current.getHours() + 1, 0, 0, 0);

            const periodEnd = Math.min(endTime.getTime(), nextHour.getTime());
            const durationInHour = (periodEnd - current.getTime()) / (1000 * 60); // in minutes

            const existing = dataMap.get(hourKey) || { focus: 0, break: 0 };
            existing.focus += durationInHour;
            dataMap.set(hourKey, existing);

            current = nextHour;
          }
        }
      });

      session.breakPeriods.forEach(period => {
        const startTime = new Date(period.startTime);
        const endTime = new Date(period.endTime);
        const startHour = startTime.getHours();
        const endHour = endTime.getHours();

        if (startHour === endHour) {
          const hourKey = `${startHour.toString().padStart(2, '0')}:00`;
          const current = dataMap.get(hourKey) || { focus: 0, break: 0 };
          current.break += period.duration / 60; // Convert seconds to minutes
          dataMap.set(hourKey, current);
        } else {
          let current = startTime;
          while (current < endTime) {
            const hourKey = `${current.getHours().toString().padStart(2, '0')}:00`;
            const nextHour = new Date(current);
            nextHour.setHours(current.getHours() + 1, 0, 0, 0);

            const periodEnd = Math.min(endTime.getTime(), nextHour.getTime());
            const durationInHour = (periodEnd - current.getTime()) / (1000 * 60); // in minutes

            const existing = dataMap.get(hourKey) || { focus: 0, break: 0 };
            existing.break += durationInHour;
            dataMap.set(hourKey, existing);

            current = nextHour;
          }
        }
      });
    });

    // Convert map to array and sort by hour
    const chartData: ChartData[] = Array.from(dataMap.entries())
      .map(([hour, data]) => ({ name: hour, ...data }))
      .sort((a, b) => parseInt(a.name.substring(0, 2)) - parseInt(b.name.substring(0, 2)));

    return chartData;
  };

  const chartData = processSessionsForChart(sessions);

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h2>Today's Productivity by Hour (Minutes)</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 50,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="focus" stackId="a" fill="#8884d8" name="Focus Time" />
          <Bar dataKey="break" stackId="a" fill="#82ca9d" name="Break Time" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DayVisualization;