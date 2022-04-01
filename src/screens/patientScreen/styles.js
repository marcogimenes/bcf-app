import styled from 'styled-components/native';

export const CardView = styled.View`
  padding: 16px;
  border-radius: 4px;
  border: 1px solid #efefef;
  background-color: #fff;
  elevation: 1;
`;

export const TimeText = styled.Text`
  margin-right: 8px;
  background-color: ${(props) => (props.highlight ? '#0064A9' : '#efefef')};
  border-radius: 20px;
  color: ${(props) => (props.highlight ? '#FFFFFF' : '#000000')};
  padding: 4px 8px 4px 8px;
  font-size: 12px;
`;
