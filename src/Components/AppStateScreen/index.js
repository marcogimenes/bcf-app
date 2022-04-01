import { useEffect, useRef, useState } from 'react';

import { AppState, BackHandler } from 'react-native';

const AppStateScreen = ({ children, onBackground, onActive, onBackButtonHandler }) => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const backAction = () => {
      if (onBackButtonHandler) {
        onBackButtonHandler();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  // Observa quando o app esta sai ou entra na tela
  useEffect(() => {
    if (appStateVisible === 'background') {
      onBackground();
    } else if (appStateVisible === 'active') {
      onActive();
    }
  }, [appStateVisible]);

  const handleAppStateChange = (nextAppState) => {
    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  return children;
};

export default AppStateScreen;
