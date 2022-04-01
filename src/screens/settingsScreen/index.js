import React, { useState, useRef, useEffect } from 'react';

import { View, FlatList, Pressable } from 'react-native';

// eslint-disable-next-line import/no-extraneous-dependencies
import Button from '../../Components/Button';
import { removeData, storeData } from '../../utils/store';
import { useMonitoramento } from '../../context/createMonitoramento';
import SelectItem from '../../Components/SelectItem';
import { Container, Separator } from './styles';

import Card from '../../Components/Card';

import { useIntegracao } from '../../context/integracao';

const SettingsScreen = ({ navigation }) => {
  const { contextData, setContext } = useMonitoramento();
  const dadosIntegracao = useIntegracao();

  const [locais, setLocais] = useState([]);

  const listagemRef = useRef();

  const bases = [
    { value: 'hap', label: 'Hapvida' },
    { value: 'schosp', label: 'PSC' },
  ];

  const [base, setBase] = useState(bases[0]);
  const [cardSeleted, setCardSeleted] = useState(-1);

  useEffect(() => {
    if (contextData.locais === null) {
      const { label, value } = base;

      setContext({
        ...contextData,
        locais: { base: { cdBase: value, nomeBase: label }, locais: [] },
      });
    } else {
      const { cdBase, nomeBase } = contextData.locais.base;
      setBase({ value: cdBase, label: nomeBase });
      setLocais(contextData.locais.locais);
    }
  }, [contextData.locais]);

  const removeLocais = async () => {
    await removeData('@locais');
  };

  const handlerExcluir = async (item) => {
    const locaisValidos = locais.filter((local) => {
      return local.posto.cdPosto !== item.posto.cdPosto;
    });

    setLocais(locaisValidos);
    setContext({
      ...contextData,
      locais: { base: { cdBase: base.value, nomeBase: base.label }, locais: locaisValidos },
    });

    await storeData('@locais', {
      base: { cdBase: base.value, nomeBase: base.label },
      locais: locaisValidos,
    });
  };

  const handlerEditar = async (item, index) => {
    const params = {
      action: 'update',
      id: index,
      unidade: item.unidade,
      setor: item.setor,
      posto: item.posto,
    };
    navigation.navigate('Locality', params);
  };

  return (
    <Container>
      <View style={{ marginHorizontal: 16, paddingBottom: 10 }}>
        <SelectItem
          placeholder="Selecione uma base"
          items={bases}
          onSelect={(baseSelected, index) => {
            removeLocais();
            const { label, value } = bases[index];

            setContext({
              ...contextData,
              locais: { base: { cdBase: value, nomeBase: label }, locais: [] },
            });
            dadosIntegracao.setContext({
              unidades: [],
              setores: [],
              postos: [],
            });

            setLocais([]);
            setBase(bases[index]);
          }}
          label="Base"
          itemActive={base}
        />
        <Separator />
        <Button
          onPress={() => navigation.navigate('Locality')}
          size={15}
          label="Adicionar Local"
          icon="plus"
          disabled={locais.length > 4}
        />
      </View>
      <Pressable style={{ flex: 1 }} onPress={() => setCardSeleted(-1)}>
        <FlatList
          ref={listagemRef}
          contentContainerStyle={{ padding: 16 }}
          data={locais}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <Card
              onPress={() => setCardSeleted(index)}
              onBlur={() => setCardSeleted(-1)}
              options
              active={index === cardSeleted}
              title={`Local ${index + 1}`}
              onDelete={() => {
                handlerExcluir(item);
                setCardSeleted(-1);
              }}
              onUpdate={() => {
                handlerEditar(item, index);
                setCardSeleted(-1);
              }}
              content={[
                { label: 'Unidade', value: item.unidade.nomeUnidade },
                { label: 'Setor', value: item.setor.nomeSetor },
                { label: 'Posto', value: item.posto.nomePosto },
              ]}
            />
          )}
        />
      </Pressable>
    </Container>
  );
};

export default SettingsScreen;
