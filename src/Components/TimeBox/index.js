import React, { useContext } from 'react';
import { View } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { ThemeContext } from 'styled-components';
import { Separator } from '../../styles/global';
import { formatTime } from '../../utils/datetime';
import { TextTime, TimeView } from './styles';

const TimeBox = ({ durationValid, durationTotal }) => {
  const themeContext = useContext(ThemeContext);
  return (
    <TimeView>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderRightColor: '#4f4f4f',
        }}>
        <MaterialIcon
          style={{ paddingRight: 15 }}
          name="alarm"
          size={30}
          color={themeContext.primary}
        />
        <View>
          <TextTime bold size={11}>
            Foco
          </TextTime>
          <TextTime bold size={17}>
            {formatTime(durationValid) || '00m 00s'}
          </TextTime>
        </View>
      </View>
      <Separator vertical />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <MaterialIcon
          style={{ paddingRight: 15 }}
          name="alarm"
          size={30}
          color={themeContext.primary}
        />
        <View>
          <TextTime bold size={11}>
            Total
          </TextTime>
          <TextTime bold size={17}>
            {durationTotal || '00m 00s'}
          </TextTime>
        </View>
      </View>
    </TimeView>
  );
};

export default TimeBox;
