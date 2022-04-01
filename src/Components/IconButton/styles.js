import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
`;

export const Button = styled.TouchableHighlight`
  border-bottom-width: 1px;
  border-color: #efefef;
  padding: 30px 10px;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
`;

export const TextPrimary = styled.Text`
  font-weight: bold;
  font-size: 16px;
  color: #4f4f4f;
`;

export const TextSecondary = styled.Text`
  font-size: 14px;
  color: #4f4f4f;
`;
