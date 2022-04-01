import React, { useState, useCallback } from 'react';
import { Text, FlatList, TouchableHighlight, View } from 'react-native';
import qs from 'qs';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import { Container, ContentField } from '../../styles/global';
import { CardView, TimeText } from './styles';
import Loading from '../../Components/Loading';
import Api from '../../services/api';
import { getDateFormatter, formatTime } from '../../utils/datetime';
import { MINUTES_PER_HOUR } from '../../constants/timer';

import { useMonitoramento } from '../../context/createMonitoramento';

const PatientScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [runningMonitoring, setRunningMonitoring] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { contextData, setContext } = useMonitoramento();
  const [maxTempo, setMaxTempo] = useState(null);

  const TIME_MAX_DEFAULT_MONITORING = 10;

  function fetchMonitoring(refresh = false) {
    setIsRefreshing(refresh);
    async function getRunningMonitoring() {
      const locaisObj = {};
      contextData.locais.locais.forEach((local) => {
        locaisObj[local.posto.cdPosto] = {
          nomePosto: local.posto.nomePosto,
          setorPosto: local.setor.nomeSetor,
        };
      });

      const getLimitMonitoring = async () => {
        try {
          const responseSettings = await Api.get('/configuracoes/MAX_MONITORAMENTO_DURATION/');
          setMaxTempo(responseSettings.data.valor);
        } catch (error) {
          Toast.show({
            type: 'error',
            text1: 'Erro Interno',
            text2: 'Erro ao buscar limite do monitoramento',
            position: 'bottom',
            visibilityTime: 10000,
          });
          setMaxTempo(TIME_MAX_DEFAULT_MONITORING);
        }
      };

      const postos = contextData.locais.locais.map((local) => local.posto.cdPosto);
      const queryParams = {
        status: 'running',
        codigo_posto: postos,
        ordering: '-timestamp',
        only_senai: true,
      };

      try {
        setIsLoading(true);
        const request = await Api.get('/monitoramentos/', {
          params: { ...queryParams },
          paramsSerializer(params) {
            return qs.stringify(params, { indices: false });
          },
        });

        await getLimitMonitoring();

        if (request.data.count > 0) {
          const pacientesRunning = request.data.results.map((paciente) => {
            const setorString = `Setor/Posto: ${locaisObj[paciente.codigo_posto].setorPosto}/${
              locaisObj[paciente.codigo_posto].nomePosto
            }`;

            return { ...paciente, setorString };
          });
          setRunningMonitoring(pacientesRunning);

          setIsLoading(false);
        } else {
          setRunningMonitoring([]);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        setRunningMonitoring([]);
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Erro na requisição',
        });
      }
    }
    if (contextData.locais?.locais.length > 0) {
      getRunningMonitoring();
    } else {
      setRunningMonitoring([]);
    }
    if (refresh) {
      setIsRefreshing(!refresh);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchMonitoring();
    }, [navigation, contextData.locais]),
  );

  if (isLoading) {
    return <Loading />;
  }

  function highlight(timeFoco) {
    if (Number(timeFoco)) {
      const minutes = Math.floor(Number(timeFoco) / MINUTES_PER_HOUR);
      return minutes >= maxTempo;
    }
    return false;
  }

  return (
    <Container>
      <ContentField>
        <FlatList
          data={runningMonitoring}
          keyExtractor={(item, index) => String(item + index)}
          ListEmptyComponent={
            <Text style={{ margin: 16 }}>
              Não há monitoramentos em execução para os postos selecionados
            </Text>
          }
          refreshing={isRefreshing}
          onRefresh={() => fetchMonitoring(true)}
          renderItem={({ item }) => (
            <TouchableHighlight
              style={{ marginBottom: 8 }}
              activeOpacity={0.6}
              underlayColor="#EFEFEF"
              onPress={() => {
                setContext({ ...contextData, paciente: {}, monitoramento: {} });
                navigation.navigate('LiveMonitoring', {
                  nomePaciente: item.nome_paciente,
                  codigoAtendimento: item.codigo_atendimento,
                  codigoPosto: item.codigo_posto,
                  monitoramento_id: item.id,
                  dtNascimento: getDateFormatter(item.data_nascimento),
                });
              }}>
              <CardView>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <TimeText highlight={highlight(item.tempo_foco)}>
                    {formatTime(item.tempo_foco) || '-'}
                  </TimeText>
                  <Text numberOfLines={1} style={{ fontSize: 16, fontWeight: 'bold', flex: 1 }}>
                    {item.nome_paciente}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                  }}>{`Cód. Atend.: ${item.codigo_atendimento} | Dt. Nasc.: ${getDateFormatter(
                  item.data_nascimento,
                )}`}</Text>
                <Text style={{ fontSize: 14 }}>{item.setorString}</Text>
              </CardView>
            </TouchableHighlight>
          )}
        />
      </ContentField>
    </Container>
  );
};

export default PatientScreen;
