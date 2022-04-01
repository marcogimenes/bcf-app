/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { ActivityIndicator, ScrollView } from 'react-native';
import { Container, ContentField, FieldView, TextField } from '../../styles/global';
import Button from '../../Components/Button';
import { useMonitoramento } from '../../context/createMonitoramento';
import { convertTime, getDateFormatter, getDateTimeFormatter } from '../../utils/datetime';
import Api from '../../services/api';
import { LoadingView } from './styles';
import ModalActions from '../../Components/ModalActions';
import { MODAL } from '../../constants/modal';

const DetailMonitoring = ({ navigation }) => {
  const [fieldsScreen, setFields] = useState({});
  const [buttonIsLoading, setLoadingButton] = useState(false);
  const [modalLiveMonitoring, setShowModalLiveMonitoring] = useState(false);
  const { contextData } = useMonitoramento();
  const [monitoramentoID, setMonitoramentoID] = useState(null);

  const handlerButtonModal = async () => {
    if (contextData.target === 'start') {
      const { cdBase } = contextData.locais.base;

      setLoadingButton(true);
      try {
        const response = await Api.post('/integracao_senai/monitoramento/', {
          codigo_atendimento: contextData.paciente.codigo_atendimento,
          monitoramento_identifier: contextData.monitoramento.id_senai,
          ip_device: contextData.monitoramento.ip_device,
          contexto: cdBase,
        });
        setMonitoramentoID(response.data.id_monitoramento);
        setShowModalLiveMonitoring(true);
        setLoadingButton(false);
      } catch ({ response }) {
        if (response) {
          Toast.show({
            type: 'error',
            text1: 'Erro de validação',
            text2: response.data.detail,
            position: 'bottom',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Erro Interno',
            text2: 'Erro de conexão',
            position: 'bottom',
          });
        }
        navigation.navigate('Home');
        setLoadingButton(false);
      }
    } else if (contextData.target === 'close') {
      setLoadingButton(true);
      try {
        await Api.get(`/monitoramentos/${contextData.monitoramento.id}/finalizar/`);
        navigation.navigate('Home', { showModal: true });
        setLoadingButton(false);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Erro Interno',
          text2: 'Erro de conexão',
          position: 'bottom',
        });
        navigation.navigate('Home');
        setLoadingButton(false);
      }
    }
  };

  const renderFields = () => {
    const fields = {
      monitoramentoId: { label: 'Monitor Fetal', value: contextData.monitoramento.id_senai },
      nomePaciente: { label: 'Paciente', value: contextData.paciente.nome },
      dataNascimento: {
        label: 'Data de Nascimento',
        value:  getDateFormatter(contextData.paciente.data_nascimento),
      },
      codAtendimento: { label: 'Cód. Atendimento', value: contextData.paciente.codigo_atendimento },
    };
    if (contextData.paciente.proximo_atendimento) {
      fields.proximoAtendimento = {
        label: 'Próximo monitoramento',
        value: getDateTimeFormatter(contextData.paciente.proximo_atendimento),
      };
    } else {
      fields.hora_alocacao = {
        label: 'Data de alocação',
        value: getDateTimeFormatter(contextData.paciente.data_alocacao),
      };
    }
    if (contextData.target === 'start') {
      if (contextData.paciente.hora_agendada_atendida && contextData.paciente.status) {
        setFields({
          ...fields,
          horaAgendadaAtendimento: {
            label: 'Hora agenda atendida',
            value: getDateTimeFormatter(contextData.paciente.hora_agendada_atendida),
          },
          status: { label: 'Status', value: contextData.paciente.status },
        });
      } else {
        setFields(fields);
      }
    } else if (contextData.target === 'close') {
      if (contextData.monitoramento.last_medicao == null) {
        fields.tempo = { label: 'Tempo monitoramento', value: '00:00:00' };
      } else {
        const duracao =
          new Date(contextData.monitoramento.last_medicao.tempo).getTime() -
          new Date(contextData.monitoramento.timestamp).getTime();

        const tempo = convertTime(duracao);
        fields.tempo = { label: 'Tempo monitoramento', value: tempo };
      }

      if (contextData.monitoramento.id_senai == null) {
        fields.monitoramentoId = { label: 'Monitor Fetal', value: 'Não identificado' };
      }

      setFields(fields);
    }
  };

  useEffect(() => {
    renderFields();
  }, []);

  if (!Object.keys(fieldsScreen).length) {
    return (
      <LoadingView>
        <ActivityIndicator size="large" color="#5500dc" />
      </LoadingView>
    );
  }

  return (
    <Container>
      <ScrollView>
        <ContentField>
          {Object.keys(fieldsScreen).map((key) => (
            <FieldView key={key}>
              <TextField bold>{fieldsScreen[key].label}</TextField>
              <TextField>{fieldsScreen[key].value}</TextField>
            </FieldView>
          ))}

          <Button
            isLoading={buttonIsLoading}
            onPress={handlerButtonModal}
            label={contextData.target === 'start' ? 'Iniciar' : 'Encerrar'}
            primary
          />
        </ContentField>
        <ModalActions
          text="Deseja acompanhar o monitoramento agora?"
          showModal={modalLiveMonitoring}
          type={MODAL.SUCCESS}
          iconNameButtonLeft="skip-next"
          buttonNameButtonLeft="Depois"
          iconNameButtonRight="thumb-up-outline"
          buttonNameButtonRight="Sim"
          handlerButtonLeft={() => {
            setShowModalLiveMonitoring(false);
            navigation.navigate('Home');
          }}
          handlerButtonRight={() => {
            setShowModalLiveMonitoring(false);
            navigation.navigate('LiveMonitoring', {
              nomePaciente: contextData.paciente.nome,
              monitoramento_id: monitoramentoID,
              codigoPosto: contextData.paciente.codigo_posto,
              codigoAtendimento: contextData.paciente.codigo_atendimento,
              dtNascimento: getDateFormatter(contextData.paciente.data_nascimento)
            });
          }}
        />
      </ScrollView>
    </Container>
  );
};

export default DetailMonitoring;
