import styled from 'styled-components/native';
import { TextField } from '../../styles/global';

export const TextInfo = styled(TextField)`
  color: ${(props) => props.theme.secondary};
  font-size: ${(props) => (props.size ? `${props.size}px` : '12px')};
  margin: 3px 0;
  text-transform: uppercase;
`;
