import React from 'react';
import { Modal } from 'react-native';

import { CenteredView, ModalBody, ModalView, TextModal } from './styles';

import FeedBackImageSuccess from '../../assets/imgs/feedback-success.svg';
import FeedBackImageError from '../../assets/imgs/feedback-error.svg';
import { MODAL } from '../../constants/modal';

const ConfirmationModal = ({ type, text, showModal, children }) => {
  const iconFeedBack = () => {
    switch (type) {
      case MODAL.SUCCESS:
        return <FeedBackImageSuccess />;
      case MODAL.ERROR:
        return <FeedBackImageError />;
      default:
        return <FeedBackImageSuccess />;
    }
  };
  return (
    <Modal style={{ backgroundColor: 'red' }} animationType="slide" transparent visible={showModal}>
      <CenteredView showModal={showModal}>
        <ModalView>
          <ModalBody>
            {children}
            {type && iconFeedBack()}
            {text && <TextModal>{text}</TextModal>}
          </ModalBody>
        </ModalView>
      </CenteredView>
    </Modal>
  );
};

export default ConfirmationModal;
