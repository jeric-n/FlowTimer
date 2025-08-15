export interface Session {
  id: string;
  startTime: string;
  endTime: string;
  totalFocusTime: number; // in seconds
  totalBreakTime: number; // in seconds
  focusPeriods: FocusPeriod[];
  breakPeriods: BreakPeriod[];
}

export interface FocusPeriod {
  startTime: string;
  endTime: string;
  duration: number; // in seconds
}

export interface BreakPeriod {
  startTime: string;
  endTime: string;
  duration: number; // in seconds
}