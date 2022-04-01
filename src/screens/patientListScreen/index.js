import React, { useState, useEffect } from 'react';

import { Text, FlatList } from 'react-native';
import qs from 'qs';
import Toast from 'react-native-toast-message';
import Collapsible from 'react-native-collapsible';
import Api from '../../services/api';

import { useMonitoramento } from '../../context/createMonitoramento';

import {
  Container,
  SearchView,
  Label,
  InnerText,
  FieldView,
  Separator,
  ButtonPaciente,
} from './styles';

import ModalActions from '../../Components/ModalActions';
import { MODAL } from '../../constants/modal';
import Loading from '../../Components/Loading';
import InputField from '../../Components/InputField';
import Button from '../../Components/Button';
import { getDateFormatter } from '../../utils/datetime';

// eslint-disable-next-line camelcase
const contains = ({ nome_paciente, codigo_atendimento }, query) => {
  const nomePaciente = nome_paciente.toLowerCase();

  if (nomePaciente.includes(query) || codigo_atendimento.includes(query)) {
    return true;
  }

  return false;
};

function postosString(locais) {
  return locais.map((local) => {
    return `${local.setor.nomeSetor}/${local.posto.nomePosto}`;
  });
}

const PatientListScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [gestantesElegiveis, setGestantesElegiveis] = useState([]);
  const [query, setQuery] = useState('');
  const [gestantesSearch, setGestantesSearch] = useState();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const { contextData, setContext } = useMonitoramento();
  const [modalVisible, setModalVisible] = useState({ show: false, message: null });
  const [modalStoppedMonitoring, setModalVisibleStoppedMonitoring] = useState(false);

  const handleSearch = (text) => {
    const filteredData = gestantesElegiveis.filter((user) => {
      return contains(user, text.toLowerCase());
    });

    if (text === '') {
      setGestantesSearch(gestantesElegiveis);
    } else {
      setGestantesSearch(filteredData);
    }
  };

  useEffect(() => {
    async function fetchGestantesElegiveis() {
      const initPostos = contextData.locais.locais.map((local) => local.posto.cdPosto);
      const queryParams = {
        monitoramento_linked: false,
        codigo_posto: initPostos,
        ordering: 'data_prevista_inicio',
      };

      try {
        setIsLoading(true);
        const request = await Api.get('/registros-agenda/', {
          params: { ...queryParams },
          paramsSerializer(params) {
            return qs.stringify(params, { indices: false });
          },
        });
        setGestantesElegiveis(request.data);
        setGestantesSearch(request.data);
        setIsLoading(false);
      } catch (e) {
        // console.warn(e);
        // console.warn(`Erro ao buscar setores ${error}`);
        Toast.show({
          type: 'error',
          text1: 'Erro na conexão',
          text2: 'Erro ao buscar pacientes',
          position: 'bottom',
        });
        setIsLoading(false);
      }
    }
    fetchGestantesElegiveis();

    // setNameTitleScreen(contextData.target, navigation);
  }, []);

  const handlerGetPaciente = async (code) => {
    const { cdBase } = contextData.locais.base;

    const queryParams = {
      contexto: cdBase,
      codigo_atendimento: code,
    };
    try {
      setIsLoading(true);
      const response = await Api.get('/registros-agenda/resumo/', { params: { ...queryParams } });
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
          setModalVisible({
            show: true,
            message: `Paciente ${pacienteData.paciente.nome} identificada.`,
          });
        }
      } else {
        setContext(state);
        setModalVisible({
          show: true,
          message: `Paciente ${pacienteData.paciente.nome} identificada.`,
        });
      }
      setIsLoading(false);

      // clearTimeout(modalVisibilityTimer);
    } catch (error) {
      setIsLoading(false);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Erro na requisição',
        text2: 'Erro ao escolher paciente',
      });
      navigation.navigate('Home');
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container>
      <Label title marginTop={8}>
        Locais Cadastrados
      </Label>
      <Collapsible collapsed={isCollapsed}>
        <FieldView>
          <Label>Unidade</Label>
          <InnerText>{contextData.locais.locais[0].unidade.nomeUnidade}</InnerText>
        </FieldView>
        <FieldView>
          <Label>Setor/Posto:</Label>
          {postosString(contextData.locais.locais).map((local) => (
            <InnerText key={local}>{local}</InnerText>
          ))}
        </FieldView>
      </Collapsible>
      <Button
        label={isCollapsed ? 'Ver detalhes' : 'Ocultar'}
        icon={isCollapsed ? 'chevron-down' : 'chevron-up'}
        size={14}
        onPress={() => setIsCollapsed(!isCollapsed)}
      />
      <SearchView>
        <Separator />
        <Label title marginTop={15} marginBottom={15}>
          Pacientes Elegíveis
        </Label>
        <InputField
          search
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Buscar Gestantes"
          value={query}
          onChangeText={(queryText) => {
            setQuery(queryText);
            handleSearch(queryText);
          }}
        />
      </SearchView>
      {gestantesElegiveis.length && gestantesSearch.length ? (
        <FlatList
          data={gestantesSearch}
          keyExtractor={(item, index) => String(item + index)}
          renderItem={({ item }) => (
            <ButtonPaciente
              label={item.nome_paciente}
              labelSecondary={`Cód. Atend: ${item.codigo_atendimento} | Dt. Nasc ${getDateFormatter(
                item.data_nascimento,
              )}`}
              onPressCallback={() => {
                handlerGetPaciente(item.codigo_atendimento);
              }}
            />
          )}
        />
      ) : (
        <Text style={{ margin: 16 }}>
          {!gestantesElegiveis.length
            ? 'Não há gestantes elegiveis para os postos selecionados'
            : 'Gestante não encontrada'}
        </Text>
      )}
      <ModalActions
        text={modalVisible.message}
        showModal={modalVisible.show}
        type={MODAL.SUCCESS}
        iconNameButtonLeft="undo"
        buttonNameButtonLeft="Refazer"
        iconNameButtonRight="thumb-up-outline"
        buttonNameButtonRight="Confirmar"
        handlerButtonLeft={() => {
          setModalVisible({ show: false, message: null });
        }}
        handlerButtonRight={() => {
          setModalVisible({ show: false, message: null });
          navigation.navigate('DetailMonitoring', { showModal: true });
        }}
      />
      <ModalActions
        showModal={modalStoppedMonitoring}
        type={MODAL.ERROR}
        text="Esta paciente não possui monitoramento em execução."
        iconNameButtonCenter="undo"
        buttonNameButtonCenter="Refazer"
        handlerButtonCenter={() => {
          setModalVisibleStoppedMonitoring(false);
        }}
      />
    </Container>
  );
};

export default PatientListScreen;
