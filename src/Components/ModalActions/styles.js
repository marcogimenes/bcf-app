import styled from 'styled-components/native';

export const LabelButton = styled.Text`
  margin-left: 10px;
`;

export const CenteredView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  ${(props) => props.showModal && 'background-color: rgba(0, 0, 0, 0.4)'}
`;

export const ModalView = styled.View`
  background-color: white;
  min-width: 350px;
  border-radius: 10px;
  max-width: 350px;
  elevation: 5;
  padding-top: 20px;
`;

export const ModalBody = styled.View`
  padding-top: 10px;
  padding-bottom: 20px;
  padding-left: 10px;
  padding-right: 10px;
`;
export const ModalField = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

export const ModalButton = styled.TouchableHighlight`
  padding: 20px;
  align-items: center;
  justify-content: center;
  flex: 1;
  flex-direction: row;
  border-top-width: 1px;
  border-color: #b7b7b7;
`;

export const ContentButtonModal = styled.View`
  flex-direction: row;
`;

export const TextModal = styled.Text`
  color: #4f4f4f;
  text-align: center;
  line-height: 20px;
  font-size: ${(props) => (props.size ? props.size : 15)}px;
  font-weight: ${(props) => (props.bold ? 'bold' : 'normal')};
`;

export const ImageView = styled.View`
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;
