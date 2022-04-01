import React from 'react';

import Home from './home.svg';
import HomeFill from './home-fill.svg';
import Settings from './settings.svg';
import SettingsFill from './settings-fill.svg';
import Pacient from './pacientes.svg';
import PacientFill from './pacientes-fill.svg';

const Icon = ({ name, focused }) => {
  switch (name) {
    case 'home':
      return focused ? <HomeFill /> : <Home />;
    case 'settings':
      return focused ? <SettingsFill /> : <Settings />;
    case 'pacientes':
      return focused ? <PacientFill height={25} /> : <Pacient height={25} />;
    default:
      return null;
  }
};

export default Icon;
