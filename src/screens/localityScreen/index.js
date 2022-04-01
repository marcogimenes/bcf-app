import { useFocusEffect } from '@react-navigation/native';

import React, { useEffect, useState, useCallback } from 'react';

import { View } from 'react-native';

import Button from '../../Components/Button';
import InputField from '../../Components/InputField';

import { useMonitoramento } from '../../context/createMonitoramento';
import { useIntegracao } from '../../context/integracao';
import { Container, ContentField, FieldView } from '../../styles/global';
import { storeData } from '../../utils/store';
import { Label, TextError } from './styles';

const LocalityScreen = ({ navigation, route }) => {
  const { contextData, setContext } = useMonitoramento();
  const dadosIntegracao = useIntegracao();
  const [unidade, setUnidade] = useState({ cdUnidade: null, nomeUnidade: null });
  const [setor, setSetor] = useState({ cdSetor: null, nomeSetor: null });
  const [posto, setPosto] = useState({ cdPosto: null, nomePosto: null });
  const [buttonLoading, setLoadingButton] = useState(false);

  const [erros, setErros] = useState({ unidade: null, setor: null, posto: null });
  const [buttonName, setNameButton] = useState('Adicionar');

  const handlerAddLocal = async () => {
    const { base, locais } = contextData.locais;
    if (route.params.id >= 0) {
      locais[route.params.id] = { unidade, setor, posto };
    } else {
      locais.push({ unidade, setor, posto });
    }
    await setContext({ ...contextData, locais: { base, locais } });

    setLoadingButton(true);
    await storeData('@locais', { base, locais });
    setLoadingButton(false);
    navigation.navigate('Settings');
  };

  useEffect(() => {
    if (unidade.cdUnidade && setor.cdSetor) {
      dadosIntegracao.setContext({
        ...dadosIntegracao.contextData,
        unidadeSelected: unidade.cdUnidade,
        setorSelected: setor.cdSetor,
        postos: [],
      });
    }
  }, [unidade, setor]);

  useEffect(() => {
    if (!route.params) {
      setNameButton('Adicionar');
      navigation.setParams({ action: 'add' });
    } else if (route.params.action === 'update') {
      setNameButton('Editar');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (route.params) {
        if (route.params.unidade) {
          setUnidade({
            cdUnidade: route.params.unidade.cdUnidade,
            nomeUnidade: route.params.unidade.nomeUnidade,
          });
        }
        if (route.params.setor) {
          setSetor({
            cdSetor: route.params.setor.cdSetor,
            nomeSetor: route.params.setor.nomeSetor,
          });
        }
        if (route.params.posto) {
          const codPostos = contextData.locais.locais.map((local) => local.posto.cdPosto);
          if (codPostos.includes(route.params.posto.cdPosto) && route.params.action !== 'update') {
            setErros({ ...erros, posto: 'Este posto já foi adicionado' });
            setPosto({ cdPosto: null, nomePosto: null });
          } else {
            setErros({ ...erros, posto: null });
            setPosto({
              cdPosto: route.params.posto.cdPosto,
              nomePosto: route.params.posto.nomePosto,
            });
          }
        }
      }
    }, [navigation, route.params]),
  );

  return (
    <Container>
      <ContentField>
        <View>
          <>
            <FieldView>
              <Label>Unidade</Label>
              <InputField
                search
                value={unidade.nomeUnidade}
                onFocus={() => {
                  navigation.navigate('SelectScreen', {
                    keyName: 'nm_unidade_atendimento',
                    title: 'Unidade',
                    titlePlural: 'Unidades',
                  });
                  setPosto({ cdPosto: null, nomePosto: null });
                  navigation.setParams({ posto: null });
                }}
                isValid
                showSoftInputOnFocus={false}
              />
              {erros.unidade && <TextError>{erros.unidade}</TextError>}
            </FieldView>
            <FieldView>
              <Label>Setor</Label>
              <InputField
                search
                value={setor.nomeSetor}
                onFocus={() => {
                  navigation.navigate('SelectScreen', {
                    keyName: 'nm_setor_hosp',
                    title: 'Setor',
                    titlePlural: 'Setores',
                  });
                  setPosto({ cdPosto: null, nomePosto: null });
                  navigation.setParams({ posto: null });
                }}
                isValid
                showSoftInputOnFocus={false}
              />
              {erros.setor && <TextError>{erros.setor}</TextError>}
            </FieldView>

            <FieldView>
              <Label>Posto</Label>
              <InputField
                disabled={!(setor.cdSetor && unidade.cdUnidade)}
                value={posto.nomePosto}
                search
                onFocus={() => {
                  navigation.navigate('SelectScreen', {
                    keyName: 'nm_setor',
                    title: 'Posto',
                    titlePlural: 'Postos',
                  });
                }}
                showSoftInputOnFocus={false}
              />
              {erros.posto && <TextError>{erros.posto}</TextError>}
              <Button
                isLoading={buttonLoading}
                onPress={handlerAddLocal}
                disabled={!unidade.cdUnidade || !setor.cdSetor || !posto.cdPosto}
                primary
                label={buttonName}
              />
            </FieldView>
          </>
        </View>
      </ContentField>
    </Container>
  );
};

export default LocalityScreen;
