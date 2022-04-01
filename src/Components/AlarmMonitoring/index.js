import React, { useContext, useEffect, useRef } from 'react';

import { Animated, Modal } from 'react-native';
import { ThemeContext } from 'styled-components';

import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Player } from '@react-native-community/audio-toolkit';
import { TextField } from '../../styles/global';
import Button from '../Button';
import Pulse from '../Pulse';
import { formatTime } from '../../utils/datetime';
import { AlarmView, TimeAnimatedView } from './styles';

function AlarmMonitoring({
  activeAlarm,
  time,
  onClickButton,
  nomePaciente,
  dataNascimentoPaciente,
}) {
  const themeContext = useContext(ThemeContext);
  const playerRef = useRef(null);

  const rotateAnimation = useRef(new Animated.Value(-15)).current;

  const handleAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnimation, {
          toValue: 15,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnimation, {
          toValue: -15,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const playAlertSound = () => {
    const player = new Player('alerta_limite_monitoramento.wav');
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
    if (activeAlarm) {
      playAlertSound();
    }

    handleAnimation();

    return () => {
      stopAlertSound();
    };
  }, [activeAlarm]);

  return (
    <Modal animationType="slide" transparent visible={activeAlarm}>
      <AlarmView>
        <TimeAnimatedView>
          <TextField bold center size={18} color={themeContext.white}>
            {nomePaciente}
          </TextField>
          <TextField bold size={18} color={themeContext.white}>
            Data de Nascimento: {dataNascimentoPaciente}
          </TextField>
          <Pulse
            interval={2000}
            size={50}
            pulseMaxSize={800}
            borderColor={themeContext.primary}
            pulseColor={themeContext.white}
            opacity={0.1}>
            <Animated.View
              style={{
                transform: [
                  {
                    rotate: rotateAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '2deg'],
                    }),
                  },
                ],
              }}>
              <MaterialIcon name="alarm" size={100} color={themeContext.white} />
            </Animated.View>
          </Pulse>
          <TextField bold size={18} color={themeContext.white}>
            Tempo de foco atingido
          </TextField>
          <TextField size={15} color={themeContext.white}>
            {formatTime(time, true)}
          </TextField>
        </TimeAnimatedView>
        <Button
          primary
          style={{ backgroundColor: themeContext.white }}
          colorText={themeContext.primary}
          label="Encerrar Monitoramento"
          onPress={() => {
            stopAlertSound();
            if (onClickButton) {
              onClickButton();
            }
          }}
        />
      </AlarmView>
    </Modal>
  );
}

export default AlarmMonitoring;
