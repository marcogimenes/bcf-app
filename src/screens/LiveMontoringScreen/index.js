import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { Container, ContentField, FieldView, RowView } from '../../styles/global';
import { TextInfo } from './styles';

import { useMonitoramento } from '../../context/createMonitoramento';
import WS from '../../services/ws';
import Loading from '../../Components/Loading';
import { formatTime } from '../../utils/datetime';
import ModalActions from '../../Components/ModalActions';
import { MODAL } from '../../constants/modal';
import Button from '../../Components/Button';
import Api from '../../services/api';
import { MINUTES_PER_HOUR } from '../../constants/timer';
import HeartComponent from '../../Components/HeartComponent';

import AppStateScreen from '../../Components/AppStateScreen';
import { calculaBPM } from '../../utils/bpm';

import TimeBox from '../../Components/TimeBox';
import PatientDataComponent from '../../Components/PatientDataComponent';
import PeriodoAlerta from '../../Components/PeriodoAlerta';
import Alert from '../../Components/Alert';
import AlarmMonitoring from '../../Components/AlarmMonitoring';

function LiveMontoringScreen({ navigation, route }) {
  const websocket = useRef(null);
  const durationInterval = useRef(null);

  const { contextData } = useMonitoramento();

  const [bpm, setBpm] = useState(0);
  const [pacienteData, setDataPaciente] = useState({});
  const [medicoes, setMedicoes] = useState([]);
  const [periodoAlertas, setPeriodoAlertas] = useState([]);
  const [periodosNotificados, setPeriodosNotificados] = useState(0);

  const [showModalFinalized, setStateModalFinalized] = useState(false);
  const [showModalActionFinish, setShowModalActionFinish] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [durationValid, setDurationValid] = useState(null);
  const [durationTotal, setDurationTotal] = useState(null);
  const [medicoesAlertas, setMedicoesAlertas] = useState([]);
  const [alertData, setAlertData] = useState({
    horaInicio: null,
    nomePaciente: null,
    type: null,
    bpm: null,
    dataNascimentoPaciente: null,
  });
  const [isAlertShow, showAlert] = useState(false);

  const [limitTimeMonitoring, setLimitMonitoring] = useState(null);
  const [isAlarm, setAlarm] = useState(false);

  const DURATION_UPDATE_TIME = 30000; // melliseconds

  const TIME_MAX_DEFAULT_MONITORING = 10;

  const resetAlarm = () => {
    if (durationValid && limitTimeMonitoring) {
      const minutes = Math.floor(durationValid / MINUTES_PER_HOUR);

      if (minutes >= limitTimeMonitoring) {
        setAlarm(true);
      }
    }
  };

  const clearIntervalDuration = () => {
    if (durationInterval.current) {
      clearInterval(durationInterval.current);
    }
  };

  const finishMonitoring = async () => {
    const monitoramentoId = contextData.monitoramento.id || route.params.monitoramento_id;
    setLoadingButton(true);

    setAlarm(false);
    clearIntervalDuration();

    try {
      await Api.get(`/monitoramentos/${monitoramentoId}/finalizar/`);
      // setLoadingButton(false);

      websocket.current.disconnect();

      setStateModalFinalized(true);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro Interno (Finalizar Monitoramento)',
        text2: 'Erro de conexão',
        position: 'bottom',
        visibilityTime: 10000,
      });
      setLoadingButton(false);
    }
  };

  const getLimitMonitoring = async () => {
    try {
      const responseSettings = await Api.get('/configuracoes/MAX_MONITORAMENTO_DURATION/');
      setLimitMonitoring(responseSettings.data.valor);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro Interno',
        text2: 'Erro ao buscar limite do monitoramento',
        position: 'bottom',
        visibilityTime: 10000,
      });
      setLimitMonitoring(TIME_MAX_DEFAULT_MONITORING);
    }
  };

  const handlerDuration = async (monitoramentoId) => {
    try {
      const responseTime = await Api.get(
        `/monitoramentos/${monitoramentoId}/valid_and_total_duration_monitoramento/`,
      );
      const durationValidSeconds = responseTime.data.total_valid_duration;
      const durationTotalSeconds = responseTime.data.total_time_monitoring;

      setDurationValid(durationValidSeconds);
      setDurationTotal(formatTime(durationTotalSeconds));
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro Interno (Buscar duração do monitoramento)',
        text2: 'Erro de conexão',
        position: 'bottom',
        visibilityTime: 10000,
      });
    }
  };

  const startIntervalDuration = () => {
    clearIntervalDuration();
    const monitoramentoId = route.params.monitoramento_id;

    handlerDuration(monitoramentoId);

    getLimitMonitoring();

    durationInterval.current = setInterval(() => {
      handlerDuration(monitoramentoId);
    }, DURATION_UPDATE_TIME);
  };

  const onMessage = (res) => {
    const data = JSON.parse(res.data);

    if (data.messageType === 'MONITORAMENTOS' && data.content?.results) {
      const monitoramentoIsRunning = data.content.results.filter(
        (monitoramento) => parseInt(monitoramento.id, 10) === route.params.monitoramento_id,
      );
      if (monitoramentoIsRunning.length === 0) {
        setAlarm(false);
        clearIntervalDuration();
        setStateModalFinalized(true);
      }
    }

    if (data.messageType === 'MEDICOES' && data.content?.results) {
      const medicoesValidas = data.content.results.filter(
        (medicao) => medicao.monitoramento_id === route.params.monitoramento_id,
      );

      setMedicoes(medicoesValidas);
    }
    if (data.messageType === 'PERIODOS_ALERTA' && data.content?.results) {
      const periodosAlertaMonitoring = data.content.results
        .filter((periodo) => periodo.monitoramento_id === route.params.monitoramento_id)
        .map((dados) => {
          return {
            id: dados.id,
            tipo: dados.tipo,
            data_inicio: dados.data_inicio,
            data_fim: dados.data_fim,
          };
        });

      if (periodosAlertaMonitoring.length) {
        setPeriodoAlertas((periodosSalvos) => {
          const periodosSalvosID = periodosSalvos?.map((periodos) => periodos.id) || [];

          if (!periodosSalvos.length) {
            return periodosAlertaMonitoring;
          }

          // atualizar a data fim dos periodos existentes
          const periodosExistentesAtualizados = periodosAlertaMonitoring.filter(
            (periodosWebSocket) => {
              return periodosSalvosID.includes(periodosWebSocket.id);
            },
          );

          // filtra os novos periodos alertas
          const novosPeriodosAlertas = periodosAlertaMonitoring.filter((periodosWebSocket) => {
            return !periodosSalvosID.includes(periodosWebSocket.id);
          });

          return novosPeriodosAlertas.concat(periodosExistentesAtualizados);
        });
      }
    }
    if (data.messageType === 'ALERTAS' && data.content?.results) {
      const medicoesAlertasValidas = data.content.results.filter(
        (medicao) => medicao.monitoramento_id === route.params.monitoramento_id,
      );

      setMedicoesAlertas(medicoesAlertasValidas);
    }
  };

  const onClose = () => {
    setBpm(-1);
  };

  const onError = () => {
    Toast.show({
      type: 'error',
      position: 'bottom',
      text1: 'Restabelecendo conexão',
    });
  };

  const conectaWebSocket = () => {
    websocket.current = new WS(
      contextData.locais.base.cdBase,
      route.params.codigoPosto,
      5000,
      onMessage,
      onClose,
      onError,
    );
  };

  const onBackgroundScreen = () => {
    websocket.current.disconnect();
    setBpm(-1);
    setAlarm(false);
    clearIntervalDuration();
    showAlert(false);
  };

  const onActiveScreen = () => {
    startIntervalDuration();
    conectaWebSocket();
  };

  const onBackButtonHandler = () => {
    navigation.navigate('Home');
  };

  // Inicia o alerta quando o tempo de monitoramento for acima do limite parametrizado e não houver alerta ativo
  useEffect(() => {
    resetAlarm();
  }, [durationValid, limitTimeMonitoring]);

  useFocusEffect(
    useCallback(() => {
      const { nomePaciente, codigoAtendimento, codigoPosto, dtNascimento } = route.params;

      navigation.setOptions({ title: nomePaciente });

      if (nomePaciente && codigoAtendimento && codigoPosto) {
        const localPosto = contextData.locais.locais.filter(
          (local) => local.posto.cdPosto === codigoPosto,
        );
        if (localPosto.length > 0) {
          const paciente = {
            nome_setor: localPosto[0].setor.nomeSetor,
            codigoPosto: localPosto[0].posto.cdPosto,
            nome_posto: localPosto[0].posto.nomePosto,
            codigo_atendimento: codigoAtendimento,
            dtNascimento,
            nomePaciente,
          };
          setDataPaciente(paciente);
        }
      }

      return () => {
        Toast.hide();
        clearIntervalDuration();
        setAlarm(false);
        showAlert(false);
        websocket.current.disconnect();
      };
    }, [navigation]),
  );

  useEffect(() => {
    const mediaBpm = calculaBPM(medicoes);
    setBpm(mediaBpm);
  }, [medicoes]);

  // Quando subir o modal com a mensagem que o monitoramento foi finalizado cancelar o alerta
  useEffect(() => {
    if (showModalFinalized) {
      clearIntervalDuration();
      setAlarm(false);

      websocket.current.disconnect();
    }
  }, [showModalFinalized]);

  useEffect(() => {
    const { nomePaciente, dtNascimento } = route.params;
    if (
      periodoAlertas.length &&
      medicoesAlertas.length &&
      !periodoAlertas[0].data_fim &&
      periodoAlertas.length !== periodosNotificados
    ) {
      setAlertData({
        horaInicio: periodoAlertas[0].data_inicio,
        nomePaciente,
        type: periodoAlertas[0].tipo,
        bpm: medicoesAlertas[0].valor_medicao,
        dataNascimentoPaciente: dtNascimento,
      });

      showAlert(true);

      setPeriodosNotificados(periodosNotificados + 1);
    }
  }, [periodoAlertas, periodosNotificados]);

  useEffect(() => {
    if (medicoesAlertas.length) {
      setAlertData({ ...alertData, bpm: medicoesAlertas[0].valor_medicao });
    }
  }, [medicoesAlertas]);

  // fecha o alarme de duração maxima do monitoramento quando o alerta de monitoramento for chamado
  useEffect(() => {
    if (isAlertShow && isAlarm) {
      setAlarm(false);
    }
  }, [isAlarm, isAlertShow]);

  // Caso os modais informativos sejam exibidos descer o de alarme
  useEffect(() => {
    if (showModalActionFinish || showModalFinalized) {
      setAlarm(false);
      clearIntervalDuration();
    } else if (!showModalActionFinish && !loadingButton) {
      // caso o usuario não encerre o monitoramento inicia o interval novamente
      startIntervalDuration();
    }
  }, [showModalActionFinish, showModalFinalized, loadingButton]);

  if (!route.params.codigoPosto || !pacienteData.codigo_atendimento) {
    return <Loading />;
  }

  return (
    <AppStateScreen
      onActive={onActiveScreen}
      onBackground={onBackgroundScreen}
      onBackButtonHandler={onBackButtonHandler}>
      <Container>
        <ScrollView>
          <ContentField>
            <PatientDataComponent pacienteData={pacienteData} />
            <FieldView>
              <TextInfo size={13}>Os dados são atualizados a cada 30 segundos</TextInfo>
              <RowView>
                <TimeBox durationValid={durationValid} durationTotal={durationTotal} />
              </RowView>
            </FieldView>
            <FieldView style={{ marginTop: 10 }}>
              <HeartComponent bpm={bpm} text="Batimento encontrado" type="audio" />
            </FieldView>
            <FieldView>
              <HeartComponent bpm={bpm} text={`${bpm} bpm`} type="wave" />
            </FieldView>
            <FieldView>
              {periodoAlertas?.length > 0 && <PeriodoAlerta periodosAlertas={periodoAlertas} />}
            </FieldView>
          </ContentField>
        </ScrollView>
        <View style={{ paddingHorizontal: 28 }}>
          <Button
            primary
            onPress={() => setShowModalActionFinish(true)}
            label="Encerrar Monitoramento"
            isLoading={loadingButton}
          />
        </View>
        <ModalActions
          showModal={showModalActionFinish}
          type={MODAL.WARNING}
          text="Deseja encerrar o monitoramento?"
          iconNameButtonLeft="undo"
          buttonNameButtonLeft="Não"
          iconNameButtonRight="thumb-up-outline"
          buttonNameButtonRight="Sim"
          handlerButtonLeft={() => {
            setShowModalActionFinish(false);
            resetAlarm();
          }}
          handlerButtonRight={async () => {
            setShowModalActionFinish(false);
            await finishMonitoring();
          }}
        />
        <ModalActions
          showModal={showModalFinalized}
          type={MODAL.WARNING}
          handlerButtonCenter={() => {
            setStateModalFinalized(false);
            websocket.current.disconnect();

            navigation.navigate('Home');
          }}
          buttonNameButtonCenter="OK"
          iconNameButtonCenter="thumb-up-outline"
          text="Monitoramento finalizado!"
        />
        <Alert
          showAlert={isAlertShow}
          nomePaciente={alertData.nomePaciente}
          dataNascimentoPaciente={alertData.dataNascimentoPaciente}
          horaInicio={alertData.horaInicio}
          bpm={alertData.bpm}
          type={alertData.type}
          onClickButton={() => {
            showAlert(false);
            resetAlarm();
          }}
        />
        <AlarmMonitoring
          activeAlarm={isAlarm}
          time={durationValid}
          dataNascimentoPaciente={pacienteData.dtNascimento}
          nomePaciente={pacienteData.nomePaciente}
          onClickButton={() => {
            setAlarm(false);
            setShowModalActionFinish(true);
          }}
        />
      </Container>
    </AppStateScreen>
  );
}

export default LiveMontoringScreen;
