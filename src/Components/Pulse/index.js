import React, { useRef, useEffect } from 'react';

import { Animated, Easing, StyleSheet, View } from 'react-native';

const Pulse = ({ size, pulseMaxSize, borderColor, pulseColor, interval, opacity, children }) => {
  const pulse = useRef(new Animated.Value(0)).current;

  const styles = StyleSheet.create({
    center: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 25,
    },
    circleWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
    },
    circle: {
      borderWidth: 4 * StyleSheet.hairlineWidth,
    },
  });

  useEffect(() => {
    Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: interval,
        useNativeDriver: false,
        easing: Easing.in,
      }),
    ).start();
  }, []);
  return (
    <View style={styles.center}>
      <View
        style={[
          styles.circleWrapper,
          {
            width: pulseMaxSize,
            height: pulseMaxSize,
            marginLeft: -pulseMaxSize / 2,
            marginTop: -pulseMaxSize / 2,
          },
        ]}>
        <Animated.View
          style={[
            styles.circle,
            {
              borderColor,
              backgroundColor: pulseColor,
              width: pulse.interpolate({
                inputRange: [0, 1],
                outputRange: [size, pulseMaxSize],
              }),
              height: pulse.interpolate({
                inputRange: [0, 1],
                outputRange: [size, pulseMaxSize],
              }),
              borderRadius: pulseMaxSize / 2,
              opacity:
                opacity ||
                pulse.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0],
                }),
            },
          ]}
        />
      </View>
      {children}
    </View>
  );
};

export default Pulse;
