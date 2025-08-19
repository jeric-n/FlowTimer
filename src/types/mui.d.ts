import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      gradientStart: string;
      gradientEnd: string;
      tableHeaderBg: string;
      tableRowEvenBg: string;
      dailyHistoryHeader: string;
    };
  }
  interface PaletteOptions {
    custom?: {
      gradientStart?: string;
      gradientEnd?: string;
      tableHeaderBg?: string;
      tableRowEvenBg?: string;
      dailyHistoryHeader?: string;
    };
  }
}