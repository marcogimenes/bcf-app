import React, { useContext, useRef, useEffect } from 'react';

import { Dimensions, Modal } from 'react-native';
import { ThemeContext } from 'styled-components';
import { Player } from '@react-native-community/audio-toolkit';
import { TextField } from '../../styles/global';
import Button from '../Button';
import Pulse from '../Pulse';
import { getTimeFormatter } from '../../utils/datetime';
import { AlertView, CircleAlert, TimeAnimatedView } from './styles';
import { ALERT_TYPE } from '../../constants/alerts';

function Alert({
  bpm,
  type,
  horaInicio,
  onClickButton,
  nomePaciente,
  dataNascimentoPaciente,
  showAlert,
}) {
  const themeContext = useContext(ThemeContext);
  const playerRef = useRef(null);

  const playAlertSound = () => {
    const player = new Player('alert.ogg');
    player.looping = true;
    player.play();
    playerRef.current = player;
  };

  const stopAlertSound = () => {
    if (playerRef.current) {
      playerRef.current.stop();
    }
  };

  useEffect(() => {
    if (showAlert) {
      playAlertSound();
    }

    return () => {
      stopAlertSound();
    };
  }, [showAlert]);

  return (
    <Modal animationType="slide" transparent visible={showAlert}>
      <AlertView>
        <TimeAnimatedView>
          <TextField bold center size={18} color={themeContext.white}>
            {nomePaciente}
          </TextField>
          <TextField bold size={18} color={themeContext.white}>
            Data de Nascimento: {dataNascimentoPaciente}
          </TextField>
          <Pulse
            interval={2000}
            size={250}
            pulseMaxSize={Dimensions.get('screen').height}
            borderColor={themeContext.primary}
            pulseColor={themeContext.white}
            opacity={0.1}>
            <CircleAlert>
              <TextField size={18} color={themeContext.white}>
                Batimentos
              </TextField>
              <TextField bold size={25} color={themeContext.white} style={{ lineHeight: 35 }}>
                {bpm} (bpm)
              </TextField>
            </CircleAlert>
          </Pulse>
          <TextField bold size={22} color={themeContext.white}>
            Alerta {ALERT_TYPE[type] || '-'}
          </TextField>
          <TextField bold size={18} color={themeContext.white}>
            {getTimeFormatter(horaInicio)}
          </TextField>
        </TimeAnimatedView>
        <Button
          primary
          style={{ backgroundColor: themeContext.white }}
          colorText={themeContext.primary}
          label="Encerrar Alerta"
          onPress={() => {
            stopAlertSound();
            if (onClickButton) {
              onClickButton();
            }
          }}
        />
      </AlertView>
    </Modal>
  );
}

export default Alert;
