import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { ThemeProvider } from 'styled-components';
import MonitoramentoProvider from './context/createMonitoramento';
import IntegracaoProvider from './context/integracao';
import { RootNavigator } from './routes';
import { Colors } from './styles/theme/colors';

const App = () => {
  return (
    <MonitoramentoProvider>
      <IntegracaoProvider>
        <NavigationContainer>
          <ThemeProvider theme={Colors}>
            <RootNavigator />
          </ThemeProvider>
          <Toast ref={(ref) => Toast.setRef(ref)} />
        </NavigationContainer>
      </IntegracaoProvider>
    </MonitoramentoProvider>
  );
};

export default App;
