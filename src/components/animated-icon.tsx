import * as SplashScreen from 'expo-splash-screen';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import GraduationCap from '@/components/graduation-cap';
import Animated, { Keyframe } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const DURATION = 600;

export function AnimatedSplashOverlay() {
  const [animate, setAnimate] = useState(false);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const splashKeyframe = new Keyframe({
    0: { opacity: 1, transform: [{ scale: 1 }] },
    35: { opacity: 1 },
    100: { opacity: 0, transform: [{ scale: 1.03 }] },
  });

  const brand = (
    <View style={{ alignItems: 'center', gap: 10 }}>
      <GraduationCap color="#FFFFFF" />
      <Text style={{ color: '#FFFFFF', fontSize: 25, fontWeight: '800' }}>InternLink</Text>
      <Text style={{ color: '#DCE7F5', fontSize: 12 }}>Internships. Find, apply, and grow.</Text>
    </View>
  );

  return animate ? (
    <Animated.View
      entering={splashKeyframe.duration(DURATION).withCallback((finished) => {
        'worklet';
        if (finished) scheduleOnRN(setVisible, false);
      })}
      style={styles.splashOverlay}
    >
      {brand}
    </Animated.View>
  ) : (
    <View
      onLayout={() => {
        SplashScreen.hideAsync().finally(() => setAnimate(true));
      }}
      style={styles.splashOverlay}
    >
      {brand}
    </View>
  );
}

const styles = StyleSheet.create({
  splashOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#082B5F',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
});
