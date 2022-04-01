import styled from 'styled-components/native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export const Container = styled.TouchableHighlight`
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  padding: 10px 0;
  margin-top: 10px;
  border-radius: 4px;
`;

export const Text = styled.Text`
  color: #4f4f4f;
  font-weight: bold;
  font-size: 16px;
`;

export const Icon = styled(MaterialIcon)`
  color: ${(props) => props.theme.primary};
  font-size: 30px;
`;

export const BlurPressable = styled.Pressable`
  background-color: rgba(0, 0, 0, 0.4);
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const BodySelect = styled.TouchableHighlight`
  background-color: white;
  min-width: 250px;
  border-radius: 10px;
  elevation: 5;
  padding: 20px;
`;

export const Label = styled.Text`
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 19px;
  color: #4f4f4f;
  margin-bottom: 10px;
`;
export const ItemSeleted = styled.Text`
  color: #4f4f4f;
  margin-top: 5px;
`;
