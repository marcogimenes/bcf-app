import styled from 'styled-components/native';

export const CenteredView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;

  ${(props) => props.showModal && 'background-color: rgba(0, 0, 0, 0.4)'}
`;

export const ModalView = styled.View`
  background-color: white;
  min-width: 250px;
  border-radius: 10px;
  elevation: 5;
  padding: 20px;
`;

export const ModalBody = styled.View`
  padding-top: 10px;
  padding-bottom: 20px;
  align-items: center;
`;

export const TextModal = styled.Text`
  font-size: 15px;
  color: #4f4f4f;
`;
