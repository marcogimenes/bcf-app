import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableHighlight } from 'react-native';
import BarCodeReaderScreen from '../screens/barCodeReaderScreen';
import QrCodeReaderScreen from '../screens/qrCodeReaderScreen';

import PatientListScreen from '../screens/patientListScreen';
import { useMonitoramento } from '../context/createMonitoramento';
import { getData } from '../utils/store';
import SplashScreen from '../screens/SplashScreen';
import { HomeTabs } from './tab.router';
import { Colors } from '../styles/theme/colors';
import DetailMonitoring from '../screens/detailMonitoringScreen';
import ManualMonitoringScreen from '../screens/manualMonitoringScreen';
import SelectScreen from '../screens/selectScreen';
import LocalityScreen from '../screens/localityScreen';
import LiveMontoringScreen from '../screens/LiveMontoringScreen';

const Stack = createStackNavigator();

export const RootNavigator = () => {
  const { contextData, setContext } = useMonitoramento();
  const [isLoaded, setLoaded] = useState(true);

  useEffect(() => {
    const fetchLocais = async () => {
      const locaisData = await getData('@locais');

      setContext({ ...contextData, locais: locaisData });

      setTimeout(() => {
        setLoaded(false);
      }, 5000);
    };

    fetchLocais();
  }, []);

  const optionsDefault = {
    title: contextData.target === 'close' ? 'Encerrar Monitoramento' : 'Iniciar Monitoramento',
    headerTitleAlign: 'center',
    headerLeft: ({ onPress }) => (
      <>
        <TouchableHighlight
          style={{
            marginLeft: 3,
            alignItems: 'center',
            borderRadius: 50,
            padding: 10,
          }}
          onPress={onPress}
          underlayColor={Colors.activeButton}>
          <Icon size={25} color={Colors.primary} name="keyboard-backspace" />
        </TouchableHighlight>
      </>
    ),
  };

  return isLoaded ? (
    <SplashScreen />
  ) : (
    <Stack.Navigator initialRouteName="HomeTabs">
      <Stack.Screen
        name="HomeTabs"
        component={HomeTabs}
        options={{ headerTitleStyle: { alignSelf: 'center' } }}
      />
      <Stack.Screen name="QRCode" component={QrCodeReaderScreen} options={optionsDefault} />
      <Stack.Screen name="BarCode" component={BarCodeReaderScreen} options={optionsDefault} />
      <Stack.Screen name="PacienteList" component={PatientListScreen} options={optionsDefault} />
      <Stack.Screen name="DetailMonitoring" component={DetailMonitoring} options={optionsDefault} />
      <Stack.Screen
        name="ManualMontioring"
        component={ManualMonitoringScreen}
        options={optionsDefault}
      />
      <Stack.Screen
        name="SelectScreen"
        component={SelectScreen}
        options={{ ...optionsDefault, title: '' }}
      />
      <Stack.Screen
        name="Locality"
        component={LocalityScreen}
        options={{ ...optionsDefault, title: 'Adicionar Local' }}
      />
      <Stack.Screen
        name="LiveMonitoring"
        component={LiveMontoringScreen}
        options={({ navigation }) => ({
          ...optionsDefault,
          headerLeft: () => (
            <>
              <TouchableHighlight
                style={{
                  marginLeft: 3,
                  alignItems: 'center',
                  borderRadius: 50,
                  padding: 10,
                }}
                onPress={() => navigation.navigate('Home')}
                underlayColor={Colors.activeButton}>
                <Icon size={25} color={Colors.primary} name="keyboard-backspace" />
              </TouchableHighlight>
            </>
          ),
        })}
      />
    </Stack.Navigator>
  );
};
