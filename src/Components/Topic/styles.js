import styled from 'styled-components/native';

export const Bullet = styled.View`
  width: 12px;
  height: 12px;
  margin-left: 8px;
  margin-right: 10px;
  background-color: ${(props) => (props.color ? props.color : '#f65b4d')};
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`;
