import styled from 'styled-components/native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export const TouchableButton = styled.TouchableHighlight`
  justify-content: center;
  padding: 10px 0;

  ${(props) =>
    props.primary &&
    ` 
    margin: 15px 0;
    align-items: center;
    border-radius: 24px;
    background-color: ${
      props.primary && !props.disabled ? props.theme.primary : props.theme.secondary
    }`}
`;

export const Text = styled.Text`
  font-size: ${(props) => (props.size ? props.size : 16)}px;
  color: ${(props) => (props.primary ? 'white' : props.theme.primary)};
  ${(props) => props.disabled && !props.primary && `color: ${props.theme.secondary}`}

  ${(props) => props.color && `color: ${props.color}`}
`;

export const Icon = styled(MaterialIcon)`
  margin-right: 5px;
  font-size: ${(props) => (props.size ? props.size : 16)}px;
  color: ${(props) => (props.primary ? 'white' : props.theme.primary)};
  ${(props) => props.disabled && `color: ${props.theme.secondary}`}
  ${(props) => props.iconColor && `color: ${props.iconColor}`}
`;
