import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Colors } from '../../styles/theme/colors';

import { Button, Container, TextPrimary, TextSecondary } from './styles';

const IconButton = ({ onPressCallback, label, labelSecondary, IconAction, style }) => {
  return (
    <Button style={style} onPress={onPressCallback} underlayColor={Colors.activeButton}>
      <>
        {IconAction && <View style={{ marginRight: 10 }}>{IconAction}</View>}
        <Container>
          <TextPrimary>{label}</TextPrimary>
          {labelSecondary && <TextSecondary>{labelSecondary}</TextSecondary>}
        </Container>
        <Icon name="chevron-right" size={30} color={Colors.primary} />
      </>
    </Button>
  );
};

export default IconButton;
