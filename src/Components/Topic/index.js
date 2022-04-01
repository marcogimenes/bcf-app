import React from 'react';

import { RowView, TextField } from '../../styles/global';
import { Bullet } from './styles';

// import { Container } from './styles';

const Topic = ({ label, text, color }) => {
  return (
    <RowView>
      <Bullet color={color} />
      {label && (
        <TextField bold size={14} style={{ paddingRight: 5 }}>
          {label}
        </TextField>
      )}
      <TextField size={14}>{text}</TextField>
    </RowView>
  );
};

export default Topic;
