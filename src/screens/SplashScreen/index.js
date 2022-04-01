import React, { useEffect, useRef } from 'react';

import { Animated, Dimensions } from 'react-native';
import {
  Container,
  WordContainer,
  Logo,
  WordAnimation,
  ScrollLeftView,
  WordFallDown,
  FooterText,
} from './styles';

const SplashScreen = () => {
  const animationScrollLeft = useRef(
    new Animated.Value(Dimensions.get('screen').width / 2),
  ).current;
  const animationWordOpacity = useRef(new Animated.Value(0)).current;
  const animationFallDown = useRef(new Animated.Value(-10)).current;

  const tituloArray = 'Batimentos Fetais'.split('');
  const animations = tituloArray.map(() => useRef(new Animated.Value(0)).current);

  const animationWord = Animated.stagger(
    60,
    animations.map((animation) =>
      Animated.timing(animation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
    ),
  );

  const animationFallDownOpacity = Animated.stagger(10, [
    Animated.timing(animationWordOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }),
    Animated.timing(animationFallDown, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }),
  ]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(animationScrollLeft, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: false,
      }),
      animationWord,
      animationFallDownOpacity,
    ]).start();
  }, []);

  return (
    <Container>
      <ScrollLeftView style={{ marginLeft: animationScrollLeft }}>
        <Logo source={require('../../assets/imgs/logo_hap.png')} />
        <WordContainer>
          {tituloArray.map((word, i) => (
            <WordAnimation
              // eslint-disable-next-line react/no-array-index-key
              key={word + i}
              style={{
                opacity: animations[i],
              }}>
              {word}
            </WordAnimation>
          ))}
        </WordContainer>
      </ScrollLeftView>
      <WordFallDown
        style={{
          opacity: animationWordOpacity,
          marginTop: animationFallDown,
        }}>
        Aplicativo de Monitoramentos
      </WordFallDown>

      <FooterText>Desenvolvido por Intmed Software</FooterText>
    </Container>
  );
};

export default SplashScreen;
