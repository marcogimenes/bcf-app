import styled from 'styled-components/native';

export const TextField = styled.TextInput`
  border: none;
  align-items: flex-end;
  flex: 1;
`;

export const ViewInput = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-width: 1px;
  border-color: ${(props) => (props.isValid ? '#efefef' : 'red')};
  border-radius: 8px;
  padding: 0 10px;
  background-color: ${(props) => (props.disabled ? '#EFEFEF' : 'white')};
`;
