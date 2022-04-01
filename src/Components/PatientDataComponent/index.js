import React from 'react';
import { FieldView, TextField } from '../../styles/global';

const PatientDataComponent = ({ pacienteData }) => {
  return (
    <>
      <FieldView>
        <TextField bold>Código de Atendimento</TextField>
        <TextField>{pacienteData.codigo_atendimento}</TextField>
      </FieldView>
      <FieldView>
        <TextField bold>Data de Nascimento</TextField>
        <TextField>{pacienteData.dtNascimento}</TextField>
      </FieldView>
      <FieldView>
        <TextField bold>Setor/Posto</TextField>
        <TextField>
          {pacienteData.nome_setor} / {pacienteData.nome_posto}
        </TextField>
      </FieldView>
    </>
  );
};

export default PatientDataComponent;
