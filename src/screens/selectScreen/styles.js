import styled from 'styled-components/native';

export const TextPrimary = styled.Text`
  font-size: 12px;
  margin: 10px 0;
  font-weight: bold;

  color: ${(props) => props.theme.primary};
`;
