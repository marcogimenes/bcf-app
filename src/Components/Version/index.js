import React, { useState, useContext } from 'react';

import { TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { ThemeContext } from 'styled-components';
import ModalActions from '../ModalActions';
import { version } from '../../../package.json';

const Version = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const themeContext = useContext(ThemeContext);
  return (
    <>
      <TouchableOpacity
        style={{ marginRight: 10, justifyContent: 'center' }}
        onPress={() => setModalVisible(true)}>
        <Icon name="information-outline" size={25} color={themeContext.primary} />
      </TouchableOpacity>
      <ModalActions
        showModal={modalVisible}
        headerText="INFORMAÇÕES"
        text={`Versão: ${version}`}
        iconNameButtonCenter="thumb-up-outline"
        buttonNameButtonCenter="Ok"
        handlerButtonCenter={() => setModalVisible(false)}
      />
    </>
  );
};

export default Version;
