import styled from 'styled-components/native';
import { Animated } from 'react-native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.primary};
`;

export const Logo = styled.Image`
  width: 40px;
  height: 40px;
  resize-mode: stretch;
  margin-right: 10px;
`;

export const WordContainer = styled.View`
  align-items: center;
  flex-direction: row;
`;

export const WordAnimation = styled(Animated.Text)`
  font-size: 28px;
  font-weight: bold;
  font-style: italic;
  color: ${(props) => props.theme.white};
  font-family: 'Lato';
  letter-spacing: 1px;
`;

export const ScrollLeftView = styled(Animated.View)`
  flex-direction: row;
`;

export const WordFallDown = styled(Animated.Text)`
  font-size: 14px;
  color: ${(props) => props.theme.white};
  font-family: 'Lato';
`;

export const FooterText = styled.Text`
  color: ${(props) => props.theme.white};
  font-family: 'Lato';
  position: absolute;
  bottom: 10px;
  font-size: 11px;
`;
