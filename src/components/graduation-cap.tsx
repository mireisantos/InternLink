
import Svg, { Path } from 'react-native-svg';

export default function GraduationCap() {
  return (
    <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 10L12 5 2 10l10 5 10-5Z"
        stroke="#172B4D"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 12v5c3.33 2 8.67 2 12 0v-5"
        stroke="#172B4D"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 10v6"
        stroke="#172B4D"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
