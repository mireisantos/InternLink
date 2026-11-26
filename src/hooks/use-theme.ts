import { Colors } from '@/constants/theme';

// InternLink is designed for light mode only (app.json sets "userInterfaceStyle": "light").
// Always return the light palette so web and native match even if the device is in dark mode.
export function useTheme() {
  return Colors.light;
}
