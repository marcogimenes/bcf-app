import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import Camera from '../../Components/Camera';
import ConfirmationModal from '../../Components/ConfirmationModal';
import ModalActions from '../../Components/ModalActions';
import { CAMERA_TYPE } from '../../constants/camera';
import { MODAL } from '../../constants/modal';
import { MODAL_ERROR_DISPLAY_TIME } from '../../constants/timer';
import { useMonitoramento } from '../../context/createMonitoramento';
import Api from '../../services/api';
import { Colors } from '../../styles/theme/colors';
import { getDateFormatter } from '../../utils/datetime';

const BarCodeReaderScreen = ({ navigation }) => {
  const [modalVisibleConfirmation, setModalConfirmationVisible] = useState({
    show: false,
    message: null,
    dataNascimento: null,
  });
  const [modalVisibleFailed, setModalVisibleFailed] = useState({ show: false, message: null });
  const [canScan, setCanScan] = useState(true);
  const { contextData, setContext } = useMonitoramento();
  const [isLoadingModal, setLoadingModal] = useState(false);
  const [modalStoppedMonitoring, setModalVisibleStoppedMonitoring] = useState(false);

  useEffect(() => {
    if (canScan) {
      const intervalo = setTimeout(() => {
        setCanScan(false);
        setModalVisibleFailed({ show: true, message: 'Paciente não identificada.' });
      }, MODAL_ERROR_DISPLAY_TIME);
      return () => clearTimeout(intervalo);
    }
    return () => null;
  }, [canScan]);

  useFocusEffect(
    useCallback(() => {
      setCanScan(true);
    }, [navigation]),
  );

  const handlerGetPaciente = async (code) => {
    const { cdBase } = contextData.locais.base;
    try {
      setLoadingModal(true);
      const response = await Api.get(
        `/registros-agenda/resumo/?codigo_atendimento=${code}&contexto=${cdBase}`,
      );
      const pacienteData = response.data;
      const state = {
        ...contextData,
        paciente: {
          ...pacienteData.paciente,
          proximo_atendimento: pacienteData.proximo_atendimento,
          status: pacienteData.status,
          hora_agendada_atendida: pacienteData.hora_agenda_atendida,
        },
      };

      if (contextData.target === 'close') {
        setContext({
          ...state,
          monitoramento: { ...pacienteData.paciente.last_monitoramento },
        });

        if (!pacienteData.paciente.last_monitoramento) {
          setModalVisibleStoppedMonitoring(true);
        } else if (
          pacienteData.paciente.last_monitoramento &&
          pacienteData.paciente.last_monitoramento.status === 'stopped'
        ) {
          setModalVisibleStoppedMonitoring(true);
        } else {
          setModalConfirmationVisible({
            show: true,
            message: `Paciente ${pacienteData.paciente.nome} identificada.`,
            dataNascimento: `Data de Nascimento: ${getDateFormatter(
              pacienteData.paciente.data_nascimento,
            )}`,
          });
        }
      } else {
        setContext(state);
        setModalConfirmationVisible({
          show: true,
          message: `Paciente ${pacienteData.paciente.nome} identificada.`,
          dataNascimento: `Data de Nascimento: ${getDateFormatter(
            pacienteData.paciente.data_nascimento,
          )}`,
        });
      }

      setLoadingModal(false);
    } catch ({ response }) {
      let error = null;
      setLoadingModal(false);
      if (response) {
        error = response.data.error;
      } else {
        error = 'Houve um erro na conexão';
      }

      setModalVisibleFailed({ show: true, message: error });
    }
  };

  return (
    <>
      <Camera
        type={CAMERA_TYPE.BAR_CODE}
        headerMessage="Aponte a câmera do celular para o código de barras da pulseira da paciente"
        onBarcodeReadCallBack={async ({ barcodes }) => {
          if (barcodes && canScan && barcodes[0].type === 'ITF') {
            setCanScan(false);
            await handlerGetPaciente(barcodes[0].data);
          }
        }}
      />
      <ConfirmationModal showModal={isLoadingModal} text="Validando Paciente">
        <ActivityIndicator size="large" color={Colors.primary} />
      </ConfirmationModal>

      <ModalActions
        showModal={modalStoppedMonitoring}
        type={MODAL.ERROR}
        text="Esta paciente não possui monitoramento em execução."
        iconNameButtonCenter="undo"
        buttonNameButtonCenter="Refazer"
        handlerButtonCenter={() => {
          setCanScan(true);
          setModalVisibleStoppedMonitoring(false);
        }}
      />

      <ModalActions
        showModal={modalVisibleFailed.show}
        type={MODAL.ERROR}
        text={modalVisibleFailed.message}
        iconNameButtonCenter="undo"
        buttonNameButtonCenter="Refazer"
        handlerButtonCenter={() => {
          setCanScan(true);
          setModalVisibleFailed({ show: false, message: null });
        }}
      />
      <ModalActions
        showModal={modalVisibleConfirmation.show}
        type={MODAL.SUCCESS}
        text={modalVisibleConfirmation.message}
        subText={modalVisibleConfirmation.dataNascimento}
        iconNameButtonLeft="undo"
        buttonNameButtonLeft="Refazer"
        iconNameButtonRight="thumb-up-outline"
        buttonNameButtonRight="Confirmar"
        handlerButtonLeft={() => {
          setCanScan(true);
          setModalConfirmationVisible({ show: false, message: null, dataNascimento: null });
        }}
        handlerButtonRight={() => {
          setModalConfirmationVisible({ show: false, message: null, dataNascimento: null });
          navigation.navigate('DetailMonitoring');
        }}
      />
    </>
  );
};

export default BarCodeReaderScreen;
