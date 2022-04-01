import styled from 'styled-components/native';
import { RowView, TextField } from '../../styles/global';

export const TextTime = styled(TextField)`
  color: ${(props) => props.theme.black};
  line-height: 20px;
  font-weight: bold;
`;

export const TimeView = styled(RowView)`
  flex: 1;
  justify-content: space-around;
  padding: 20px;
  border-radius: 4px;
  background-color: ${(props) => props.theme.activeButton};
`;
