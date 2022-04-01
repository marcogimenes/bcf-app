import React, { useRef } from 'react';
import { Animated } from 'react-native';

function FadeInAndOut({ style, children }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const springValue = useRef(new Animated.Value(1)).current;

  const fadeInAndOut = Animated.sequence([
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 750,
      useNativeDriver: true,
    }),
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 750,
      useNativeDriver: true,
    }),
  ]);

  Animated.loop(
    Animated.parallel([
      fadeInAndOut,
      Animated.timing(springValue, {
        toValue: 1,
        friction: 3,
        tension: 40,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]),
  ).start();
  return <Animated.View style={{ ...style, opacity: fadeAnim }}>{children}</Animated.View>;
}

export default FadeInAndOut;
