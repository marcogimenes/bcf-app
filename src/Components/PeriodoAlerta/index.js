import React from 'react';
import { View } from 'react-native';
import { ALERT_TYPE } from '../../constants/alerts';
import { RowView, TextField } from '../../styles/global';
import { getTimeFormatter } from '../../utils/datetime';

import Topic from '../Topic';

// import { Container } from './styles';

const PeriodoAlerta = ({ periodosAlertas }) => {
  return (
    <View>
      <TextField bold style={{ paddingVertical: 10 }}>
        Alertas
      </TextField>
      {periodosAlertas.map((periodo) => (
        <RowView key={periodo.id}>
          <Topic
            label={ALERT_TYPE[periodo.tipo]}
            text={`${getTimeFormatter(periodo.data_inicio)} - ${getTimeFormatter(
              periodo.data_fim,
            )}`}
          />
        </RowView>
      ))}
    </View>
  );
};

export default PeriodoAlerta;
