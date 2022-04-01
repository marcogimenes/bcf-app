import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: white;
`;

export const ContentField = styled.View`
  margin: 20px;
  flex: 1;
`;

export const TextField = styled.Text`
  font-weight: ${(props) => (props.bold ? 'bold' : 'normal')};
  font-size: ${(props) => (props.size ? props.size : 16)}px;
  color: ${(props) => (props.color ? props.color : '#000')};
  line-height: 25px;
  text-align: ${(props) => (props.center ? 'center' : 'left')};
`;

export const FieldView = styled.View`
  flex-direction: column;
  margin-bottom: 15px;
`;
export const RowView = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Separator = styled.View`
  ${(props) => (props.vertical ? 'height: 40px;' : 'width: 40px')}
  border-width: 1px;
  border-color: ${(props) => props.theme.secondary};
`;
