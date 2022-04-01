import React from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RowView, TextField } from '../../styles/global';
import { HeartView } from './styles';
import AudioWaveImg from '../../assets/imgs/audio-wave.svg';
import HeartWaveImg from '../../assets/imgs/heart-wave.svg';
import FadeInAndOut from '../FadeInAndOut';

const HeartComponent = ({ bpm, text, type }) => {
  return (
    <RowView>
      <HeartView>
        <MaterialIcon name="heart-outline" size={30} color="#F65B4D" />
        {bpm > 0 && (
          <FadeInAndOut>{type === 'audio' ? <AudioWaveImg /> : <HeartWaveImg />}</FadeInAndOut>
        )}
      </HeartView>
      <TextField>{bpm > 0 ? text : 'Buscando batimentos fetais...'}</TextField>
    </RowView>
  );
};
export default HeartComponent;
