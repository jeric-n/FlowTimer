export enum BreakPreset {
  DEFAULT = 'default',
  PRESET2 = 'preset2',
  PRESET3 = 'preset3',
}

export const LOCAL_STORAGE_KEYS = {
  SESSIONS: 'flowtimer_sessions',
  DAILY_TOTALS: 'flowtimer_daily_totals',
  SETTINGS: 'flowtimer_settings',
};

export const TIME_IN_SECONDS = {
  MINUTE: 60,
  HOUR: 3600,
};

export const BREAK_DURATIONS = {
  PRESET3_SHORT_FOCUS: 5 * TIME_IN_SECONDS.MINUTE, // For focus < 25 minutes
  PRESET3_MEDIUM_FOCUS: 8 * TIME_IN_SECONDS.MINUTE, // For focus 25-50 minutes
  PRESET3_LONG_FOCUS_50_90: 10 * TIME_IN_SECONDS.MINUTE, // For focus 50-90 minutes
  PRESET3_VERY_LONG_FOCUS: 15 * TIME_IN_SECONDS.MINUTE, // For focus > 90 minutes
};
