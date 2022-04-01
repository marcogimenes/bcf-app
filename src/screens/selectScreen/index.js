import React, { useState, useEffect } from 'react';

import { FlatList, Text, TouchableHighlight, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Container, ContentField, FieldView } from '../../styles/global';
import InputField from '../../Components/InputField';

import Api from '../../services/api';
import { useMonitoramento } from '../../context/createMonitoramento';
import { useIntegracao } from '../../context/integracao';
import { TextPrimary } from './styles';
import { Colors } from '../../styles/theme/colors';
import Loading from '../../Components/Loading';

const SelectScreen = ({ navigation, route }) => {
  const [dados, setDados] = useState([]);
  const [dataSearch, setDataSearch] = useState([]);
  const [value, setValue] = useState();
  const { contextData } = useMonitoramento();
  const [screenLoading, setStateLoadingScreen] = useState(true);
  const dadosIntegracao = useIntegracao();

  useEffect(() => {
    navigation.setOptions({ title: route.params.title ? route.params.title : null });

    let mounted = true;

    const getUnidades = async () => {
      try {
        let resultsUnidades = [];
        if (dadosIntegracao.contextData.unidades.length) {
          resultsUnidades = dadosIntegracao.contextData.unidades;
        } else {
          const result = await Api.get(
            `/integracao/${contextData.locais.base.cdBase}/unidades-atendimento/`,
          );
          resultsUnidades = result.data;
          dadosIntegracao.setContext({
            ...dadosIntegracao.contextData,

            unidades: resultsUnidades,
          });
        }

        if (mounted) {
          setDados(resultsUnidades);
          setDataSearch(resultsUnidades);
          setStateLoadingScreen(false);
        }
      } catch (error) {
        console.log(error);
        setTimeout(() => {
          Toast.show({
            type: 'error',
            text1: 'Erro na conexão',
            text2: 'Erro ao buscar os dados',
            position: 'bottom',
          });
        }, 1000);
      }
    };

    const getSetores = async () => {
      try {
        let resultsSetores = [];
        if (dadosIntegracao.contextData.setores.length) {
          resultsSetores = dadosIntegracao.contextData.setores;
        } else {
          const results = await Api.get(
            `/integracao/${contextData.locais.base.cdBase}/setores-hospitalar/`,
          );
          resultsSetores = results.data;
          dadosIntegracao.setContext({
            ...dadosIntegracao.contextData,

            setores: resultsSetores,
          });
        }
        if (mounted) {
          setDados(resultsSetores);
          setDataSearch(resultsSetores);
          setStateLoadingScreen(false);
        }
      } catch (error) {
        setTimeout(() => {
          Toast.show({
            type: 'error',
            text1: 'Erro na conexão',
            text2: 'Erro ao buscar os dados',
            position: 'bottom',
          });
        }, 1000);
      }
    };

    const getPostos = async () => {
      const { setorSelected, unidadeSelected, postos } = dadosIntegracao.contextData;

      let resultsPostos = [];

      if (postos.length) {
        resultsPostos = postos;
      } else {
        try {
          const results = await Api.get(
            `/integracao/${contextData.locais.base.cdBase}/postos/${setorSelected}/${unidadeSelected}/`,
          );
          resultsPostos = results.data;

          dadosIntegracao.setContext({
            ...dadosIntegracao.contextData,
            postos: resultsPostos,
          });
        } catch (error) {
          console.log(error);
          Toast.show({
            type: 'error',
            text1: 'Erro na conexão',
            text2: 'Erro ao buscar os dados',
            position: 'bottom',
          });
        }
      }

      if (mounted) {
        setDataSearch(resultsPostos);
        setDados(resultsPostos);
        setStateLoadingScreen(false);
      }
    };

    if (route.params.title === 'Unidade') {
      getUnidades();
    } else if (route.params.title === 'Setor') {
      getSetores();
    } else if (route.params.title === 'Posto') {
      getPostos();
    }

    return () => {
      mounted = false;
    };
  }, []);

  const contains = (data, query) => {
    const nomeQuery = data[route.params.keyName].toLowerCase();

    if (nomeQuery.includes(query)) {
      return true;
    }

    return false;
  };

  const handleSearch = (text) => {
    const filteredData = dados.filter((data) => {
      return contains(data, text.toLowerCase());
    });

    if (text === '') {
      setDataSearch(dados);
    } else {
      setDataSearch(filteredData);
    }
  };

  const Item = ({ item }) => {
    return (
      <TouchableHighlight
        underlayColor={Colors.activeButton}
        style={{
          paddingVertical: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        onPress={() => {
          const params = {};
          if (route.params.title === 'Unidade') {
            params.unidade = {
              cdUnidade: item.cd_unidade_atendimento,
              nomeUnidade: item.nm_unidade_atendimento,
            };
          } else if (route.params.title === 'Setor') {
            params.setor = { cdSetor: item.cd_setor_hosp, nomeSetor: item.nm_setor_hosp };
          } else if (route.params.title === 'Posto') {
            params.posto = {
              cdPosto: item.cd_setor,
              nomePosto: item.nm_setor,
            };
          }
          navigation.navigate('Locality', params);
        }}>
        <View style={{ flex: 1 }}>
          <Text>{item[route.params.keyName]}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  if (screenLoading) {
    return <Loading />;
  }

  return (
    <Container>
      <ContentField>
        <FieldView>
          <InputField
            search
            placeholder="Pesquise"
            value={value}
            isValid
            onChangeText={(valor) => {
              setValue(valor);
              handleSearch(valor);
            }}
          />
        </FieldView>
        <TextPrimary>{route.params.titlePlural} disponíveis</TextPrimary>
        <View style={{ flex: 1 }}>
          {dataSearch.length ? (
            <FlatList
              data={dataSearch}
              keyExtractor={(item, index) => String(item + index)}
              initialNumToRender={15}
              renderItem={({ item }) => <Item item={item} />}
            />
          ) : (
            <Text>Não encontrado.</Text>
          )}
        </View>
      </ContentField>
    </Container>
  );
};

export default SelectScreen;
