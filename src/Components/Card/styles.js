import styled from 'styled-components/native';
import Button from '../Button';

export const Options = styled.View`
  position: absolute;
  top: 20px;
  right: 10px;
  elevation: 5;
  background-color: white;
  border-radius: 4px;
  justify-content: space-between;
`;

export const BodyCard = styled.View`
  padding: 10px 0;
`;

export const TitleCard = styled.Text`
  font-weight: bold;
  font-size: 16px;
`;

export const TextCard = styled.Text`
  font-size: 14px;
  color: #4f4f4f;
`;

export const CardView = styled.Pressable`
  min-height: 150px;
  padding: 25px;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 10px;
  border-width: 1px;
  elevation: 4;
  border-color: ${(props) => (props.active ? props.theme.primary : '#fff')};
`;

export const HeaderCard = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ButtonOption = styled(Button)`
  padding: 20px;
`;
