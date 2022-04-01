import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Colors } from '../../styles/theme/colors';
import { LoadingView } from './styles';

function Loading() {
  return (
    <LoadingView>
      <ActivityIndicator size="large" color={Colors.primary} />
    </LoadingView>
  );
}

export default Loading;
