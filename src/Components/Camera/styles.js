import styled from 'styled-components/native';

import { RNCamera } from 'react-native-camera';
import { Dimensions } from 'react-native';

const WIDTH = Dimensions.get('screen').width;

export const BoxMessage = styled.View`
  position: absolute;
  z-index: 1000;
  width: ${WIDTH}px;
  background-color: ${(props) => props.theme.primary};
`;

export const TextMessage = styled.Text`
  color: #fff;
  font-size: 16px;
  padding: 16px;
  text-align: center;
`;

export const CameraStyled = styled(RNCamera)`
  height: 100%;
`;

export const DebugView = styled.View`
  position: absolute;
  width: ${(props) => props.type.height * 100}%;
  height: ${(props) => props.type.width * 100}%;
  top: ${(props) => props.type.x * 100}%;
  left: ${(props) => props.type.y * 100}%;
  border-width: 2px;
  border-color: red;
  opacity: 0.5;
`;
