import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ConfirmationModal from '../../Components/ConfirmationModal';
import Camera from '../../Components/Camera';
import { useMonitoramento } from '../../context/createMonitoramento';
import Api from '../../services/api';
import { MODAL_ERROR_DISPLAY_TIME } from '../../constants/timer';
import { CAMERA_TYPE } from '../../constants/camera';
import { MODAL } from '../../constants/modal';
import ModalActions from '../../Components/ModalActions';
import { Colors } from '../../styles/theme/colors';

const QrCodeReaderScreen = ({ navigation }) => {
  const [modalConfirmation, setModalConfirmationVisible] = useState({ show: false, message: null });
  const [modalVisibleFailed, setModalVisibleFailed] = useState({ show: false, message: null });
  const [canScan, setCanScan] = useState(true);
  const { contextData, setContext } = useMonitoramento();
  const [isLoadingModal, setLoadingModal] = useState(false);
  const [cameraActive, activeCamera] = useState(true);

  const handlerValidateCode = async (code) => {
    try {
      setLoadingModal(true);
      const response = await Api.get(`integracao_senai/${code}/validate_code/`);
      setLoadingModal(false);
      return response.data;
    } catch (error) {
      setLoadingModal(false);
      throw error.toString();
    }
  };

  useEffect(() => {
    if (canScan) {
      const intervalo = setTimeout(() => {
        setCanScan(false);
        setModalVisibleFailed({ show: true, message: 'Monitor fetal não identificado' });
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

  useEffect(() => {
    navigation.addListener('focus', () => {
      activeCamera(true);
    });
    navigation.addListener('blur', () => {
      activeCamera(false);
    });
  }, []);

  return (
    <>
      {cameraActive && (
        <Camera
          type={CAMERA_TYPE.QR_CODE}
          headerMessage="Aponte a câmera do celular para o QRCODE do Monitor Fetal"
          onBarcodeReadCallBack={async ({ barcodes }) => {
            if (barcodes && canScan && barcodes[0].type === 'QR_CODE') {
              setCanScan(false);
              try {
                const identificador = barcodes[0].data;
                const response = await handlerValidateCode(identificador);

                if (response.validate) {
                  setContext({
                    ...contextData,
                    monitoramento: { id_senai: identificador },
                  });
                  setModalConfirmationVisible({
                    show: true,
                    message: `Monitor fetal ${identificador} identificado.`,
                  });
                } else {
                  setModalVisibleFailed({ show: true, message: response.message });
                }
              } catch (error) {
                setModalVisibleFailed({
                  show: true,
                  message: `Houve uma falha na conexão\n ${error}`,
                });
              }
            }
          }}
        />
      )}

      <ConfirmationModal showModal={isLoadingModal} text="Validando Código">
        <ActivityIndicator size="large" color={Colors.primary} />
      </ConfirmationModal>
      <ModalActions
        showModal={modalVisibleFailed.show}
        type={MODAL.ERROR}
        text={modalVisibleFailed.message}
        iconNameButtonLeft="undo"
        buttonNameButtonLeft="Refazer"
        iconNameButtonRight="format-text"
        buttonNameButtonRight="Digitar Código"
        handlerButtonLeft={() => {
          setCanScan(true);
          setModalVisibleFailed({ show: false, message: null });
        }}
        handlerButtonRight={() => {
          setModalVisibleFailed({ show: false, message: null });
          navigation.navigate('ManualMontioring');
        }}
      />
      <ModalActions
        showModal={modalConfirmation.show}
        type={MODAL.SUCCESS}
        text={modalConfirmation.message}
        iconNameButtonLeft="undo"
        buttonNameButtonLeft="Refazer"
        iconNameButtonRight="thumb-up-outline"
        buttonNameButtonRight="Confirmar"
        handlerButtonLeft={() => {
          setCanScan(true);
          setModalConfirmationVisible({ show: false, message: null });
        }}
        handlerButtonRight={() => {
          setModalConfirmationVisible({ show: false, message: null });
          navigation.navigate('BarCode');
        }}
      />
    </>
  );
};

export default QrCodeReaderScreen;
