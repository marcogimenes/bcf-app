import React from 'react';

import { Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../styles/theme/colors';

import {
  CenteredView,
  ModalView,
  ContentButtonModal,
  LabelButton,
  ModalButton,
  TextModal,
  ImageView,
  ModalBody,
} from './styles';
import { MODAL } from '../../constants/modal';
import { IconModalError, IconModalSuccess, IconModalWarning } from '../../assets/imgs/modal';

const ModalActions = ({
  showModal,
  handlerButtonLeft,
  handlerButtonRight,
  handlerDismiss,
  type,
  text,
  subText,
  headerText,
  iconNameButtonLeft,
  iconNameButtonRight,
  buttonNameButtonLeft,
  buttonNameButtonRight,
  handlerButtonCenter,
  iconNameButtonCenter,
  buttonNameButtonCenter,
}) => {
  const IconModal = () => {
    switch (type) {
      case MODAL.ERROR:
        return <IconModalError />;
      case MODAL.SUCCESS:
        return <IconModalSuccess />;
      case MODAL.WARNING:
        return <IconModalWarning />;
      default:
        return <IconModalSuccess />;
    }
  };
  return (
    <Modal animationType="slide" transparent visible={showModal} onRequestClose={handlerDismiss}>
      <CenteredView showModal={showModal}>
        <ModalView>
          <ModalBody>
            {type ? (
              <ImageView>
                {IconModal()}
                <TextModal style={{ marginTop: 10 }} bold>
                  {type}!
                </TextModal>
              </ImageView>
            ) : (
              <TextModal style={{ marginBottom: 10 }} bold>
                {headerText}
              </TextModal>
            )}
            <TextModal>{text}</TextModal>
            {subText && (
              <TextModal style={{ marginTop: 10 }} size={13}>
                {subText}
              </TextModal>
            )}
          </ModalBody>
          <ContentButtonModal>
            {!(buttonNameButtonCenter && buttonNameButtonCenter) ? (
              <>
                <ModalButton
                  style={{
                    borderRightColor: '#b7b7b7',
                    borderRightWidth: 1,
                    borderBottomLeftRadius: 10,
                  }}
                  onPress={handlerButtonLeft}
                  underlayColor={Colors.activeButton}>
                  <>
                    <Icon name={iconNameButtonLeft} color={Colors.primary} size={20} />
                    <LabelButton>{buttonNameButtonLeft}</LabelButton>
                  </>
                </ModalButton>
                <ModalButton
                  onPress={handlerButtonRight}
                  underlayColor={Colors.activeButton}
                  style={{ borderBottomRightRadius: 10 }}>
                  <>
                    <Icon name={iconNameButtonRight} color={Colors.primary} size={20} />
                    <LabelButton>{buttonNameButtonRight}</LabelButton>
                  </>
                </ModalButton>
              </>
            ) : (
              <ModalButton
                onPress={handlerButtonCenter}
                underlayColor={Colors.activeButton}
                style={{ borderBottomRightRadius: 10, borderBottomLeftRadius: 10 }}>
                <>
                  <Icon name={iconNameButtonCenter} color={Colors.primary} size={20} />
                  <LabelButton>{buttonNameButtonCenter}</LabelButton>
                </>
              </ModalButton>
            )}
          </ContentButtonModal>
        </ModalView>
      </CenteredView>
    </Modal>
  );
};

export default ModalActions;
