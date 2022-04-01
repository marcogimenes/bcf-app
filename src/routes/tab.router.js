import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Text, View } from 'react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import SettingsScreen from '../screens/settingsScreen';
import Version from '../Components/Version';

import HomeScreen from '../screens/home';
import PatientScreen from '../screens/patientScreen';
import IconTab from '../assets/imgs/menu';

const Tab = createBottomTabNavigator();

const routes = {
  Home: { title: 'Monitoramento', icon: 'home', component: HomeScreen },
  Patient: { title: 'Pacientes', icon: 'pacientes', component: PatientScreen },
  Settings: { title: 'Configurações', icon: 'settings', component: SettingsScreen },
};

export const HomeTabs = ({ navigation, route: routeNavigation }) => {
  function getHeaderTitle(route) {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
    const { title } = routes[routeName];
    return title;
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: getHeaderTitle(routeNavigation),
      headerTitleAlign: 'Center',
      headerRight: () => {
        if (getHeaderTitle(routeNavigation) === 'Configurações') {
          return <Version />;
        }
        return null;
      },
    });
  }, [navigation, routeNavigation]);

  const IconActive = ({ routeName, iconName, focused }) => {
    return (
      <View
        style={{
          width: 100,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {focused ? (
          <>
            <IconTab name={iconName} focused />
            <View
              style={{
                width: 30,
                borderColor: '#0064A9',
                borderWidth: 2,
                borderRadius: 2,
                marginTop: 10,
                marginBottom: 3,
              }}
            />
          </>
        ) : (
          <>
            <IconTab name={iconName} />
            <Text style={{ fontSize: 12 }}>{routeName}</Text>
          </>
        )}
      </View>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const { title, icon } = routes[route.name];
          return (
            <IconActive
              routeName={title}
              focused={focused}
              iconName={icon}
              size={size}
              color={color}
            />
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: '#0064A9',
        inactiveTintColor: 'gray',
        showLabel: false,
        style: {
          borderTopColor: '#fff',
        },
      }}>
      {Object.keys(routes).map((route) => {
        const { component } = routes[route];
        return <Tab.Screen key={route} name={route} component={component} />;
      })}
    </Tab.Navigator>
  );
};
