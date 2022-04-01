import styled from 'styled-components/native';
import IconButton from '../../Components/IconButton';

export const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 16px;
`;

export const SearchView = styled.View`
  margin-top: 16px;
`;

export const Label = styled.Text`
  font-weight: 700;
  font-size: 16px;
  color: #4f4f4f;
  margin-top: ${(props) => (props.marginTop ? props.marginTop : 0)}px;
  margin-bottom: ${(props) => (props.marginBottom ? props.marginBottom : 0)}px;
  ${(props) => props.title && 'text-transform: uppercase;'}
`;

export const InnerText = styled.Text`
  font-weight: 400;
  font-size: 14px;
  margin-top: 8px;
`;

export const SearchBar = styled.View`
  background-color: #fff;
  margin-top: 10px;
  border-radius: 20px;
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-radius: 4px;
  border-color: #efefef;
  padding: 4px;
`;

export const Separator = styled.View`
  border-width: 0.5px;
  border-color: #b7b7b7;
  opacity: 0.2;
`;

export const FieldView = styled.View`
  margin-top: 20px;
`;

export const ButtonPaciente = styled(IconButton)`
  padding: 20px 0px;
`;
