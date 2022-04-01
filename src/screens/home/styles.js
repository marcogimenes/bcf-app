import styled from 'styled-components/native';

export const CenteredView = styled.View`
  margin: 0px 10px;
  flex: 1;
  background-color: #fff;
`;

export const HomeView = styled.View`
  background-color: #fff;
  flex: 1;
`;

export const ErrorView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const TextPrimary = styled.Text`
  font-size: ${(props) => (props.size ? props.size : 20)}px;
  color: ${(props) => props.theme.primary};
  font-weight: ${(props) => (props.bold ? 'bold' : 'normal')};
`;

export const TextSecondary = styled.Text`
  font-size: ${(props) => (props.size ? props.size : 20)}px;
  color: ${(props) => props.theme.secondary};
  font-weight: ${(props) => (props.bold ? 'bold' : 'normal')};
  text-align: center;
`;
