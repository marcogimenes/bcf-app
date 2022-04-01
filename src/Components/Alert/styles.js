import styled from 'styled-components/native';

export const AlertView = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.primary};
  padding: 0 20px;
`;

export const TimeAnimatedView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const CircleAlert = styled.View`
  width: 250px;
  height: 250px;
  border-bottom-left-radius: 125px;
  border-bottom-right-radius: 125px;
  border-top-right-radius: 125px;
  border-top-left-radius: 125px;
  border-width: 12px;
  align-items: center;
  justify-content: center;
  border-color: #cce0ee;
`;
