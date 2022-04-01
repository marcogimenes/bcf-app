import React, { useEffect, useState, useCallback } from 'react';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { useMonitoramento } from '../../context/createMonitoramento';
import ConfirmationModal from '../../Components/ConfirmationModal';
import { CenteredView, ErrorView, HomeView, TextPrimary, TextSecondary } from './styles';
import IconButton from '../../Components/IconButton';
import ErrorImg from '../../assets/imgs/feedback-error.svg';
import { MODAL } from '../../constants/modal';

const HomeScreen = ({ route, navigation }) => {
  const { contextData, setContext } = useMonitoramento();
  const [modalVisible, setModalVisible] = useState(false);
  const [locais, setLocais] = useState([]);
  useFocusEffect(
    useCallback(() => {
      if (route.params?.showModal) {
        setModalVisible(true);
        navigation.setParams({ showModal: false });
      }
      if (contextData.locais !== null) {
        setLocais(contextData.locais.locais);
      } else {
        setLocais([]);
      }
    }, [route.params?.showModal, navigation, contextData.locais]),
  );

  useEffect(() => {
    if (modalVisible) {
      const modalVisibilityTimer = setTimeout(() => {
        setModalVisible(!modalVisible);
      }, 5000);
      return () => clearTimeout(modalVisibilityTimer);
    }
    return () => null;
  }, [modalVisible]);

  return (
    <HomeView>
      <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
      <CenteredView>
        {locais.length ? (
          <>
            <IconButton
              label="Iniciar Monitoramento"
              IconAction={<Icon name="play-circle-outline" size={30} color="#4F4F4F" />}
              onPressCallback={() => {
                navigation.navigate('QRCode');
                setContext({ ...contextData, monitoramento: {}, paciente: {}, target: 'start' });
              }}
            />

            <IconButton
              IconAction={<Icon name="stop-circle-outline" size={30} color="#4F4F4F" />}
              label="Encerrar Monitoramento"
              onPressCallback={() => {
                navigation.navigate('BarCode');
                setContext({ ...contextData, monitoramento: {}, paciente: {}, target: 'close' });
              }}
            />
          </>
        ) : (
          <ErrorView>
            <TextPrimary bold size={19}>
              Opções não disponíveis
            </TextPrimary>
            <ErrorImg height={200} />
            <TextSecondary size={19}>
              Acesse as <TextPrimary size={19}>Configurações</TextPrimary> e adicione pelo menos um
              local para mostrar as opções de monitoramento.
            </TextSecondary>
          </ErrorView>
        )}

        <ConfirmationModal
          text={
            contextData.target === 'start'
              ? 'Monitoramento iniciado com sucesso!'
              : 'Monitoramento encerrado com sucesso!'
          }
          showModal={modalVisible}
          type={MODAL.SUCCESS}
        />
      </CenteredView>
    </HomeView>
  );
};

export default HomeScreen;
