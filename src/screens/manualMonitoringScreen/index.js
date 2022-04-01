import { Formik } from 'formik';
import React, { useState } from 'react';

import Button from '../../Components/Button';
import InputField from '../../Components/InputField';
import { useMonitoramento } from '../../context/createMonitoramento';
import Api from '../../services/api';
import { Container, ContentField, FieldView, TextField } from '../../styles/global';
import { TextError } from './styles';
import { MODAL } from '../../constants/modal';
import ModalActions from '../../Components/ModalActions';

const ManualMonitoringScreen = ({ navigation }) => {
  const [buttonIsLoading, setLoadingButton] = useState(false);
  const [modalVisible, setModalVisible] = useState({ show: false, message: null });
  const { contextData, setContext } = useMonitoramento();

  const handlerValidateCode = async (code) => {
    try {
      setLoadingButton(true);
      const response = await Api.get(`integracao_senai/${code}/validate_code/`);
      setLoadingButton(false);
      return response.data;
    } catch (error) {
      setLoadingButton(false);
      throw error.toString();
    }
  };
  return (
    <Container>
      <ContentField>
        <FieldView>
          <TextField bold>Monitor Fetal</TextField>
          <Formik
            initialValues={{ valueInput: '' }}
            onSubmit={async (values, form) => {
              setLoadingButton(true);
              try {
                const response = await handlerValidateCode(values.valueInput);
                if (response.validate) {
                  setContext({ ...contextData, monitoramento: { id_senai: values.valueInput } });
                  setModalVisible({
                    show: true,
                    message: `Monitor fetal ${values.valueInput} identificado.`,
                  });
                } else {
                  form.setFieldError('valueInput', response.message);
                }
              } catch (error) {
                form.setFieldError('valueInput', `Falha na conexão: ${error}`);
              }
              setLoadingButton(false);
            }}
            validate={(values) => {
              const errors = {};
              if (!values.valueInput) {
                errors.valueInput = 'Campo requerido';
              } else if (!/^[a-zA-Z]{10}$/.test(values.valueInput)) {
                errors.valueInput = 'Digite um código com 10 digitos e apenas letras.';
              }
              return errors;
            }}>
            {({ handleSubmit, handleChange, values, errors, isValid }) => (
              <>
                <FieldView>
                  <InputField
                    autoCapitalize="characters"
                    value={values.valueInput}
                    maxLength={10}
                    isValid={isValid}
                    onChangeText={handleChange('valueInput')}
                    placeholder="Digite um código"
                  />
                  {errors.valueInput && <TextError>{errors.valueInput}</TextError>}
                </FieldView>
                <Button
                  onPress={handleSubmit}
                  isLoading={buttonIsLoading}
                  label="Verificar"
                  primary
                  disabled={!isValid || !values.valueInput.length}
                />
              </>
            )}
          </Formik>
        </FieldView>
      </ContentField>
      <ModalActions
        text={modalVisible.message}
        showModal={modalVisible.show}
        type={MODAL.SUCCESS}
        iconNameButtonLeft="undo"
        buttonNameButtonLeft="Refazer"
        iconNameButtonRight="thumb-up-outline"
        buttonNameButtonRight="Confirmar"
        handlerButtonLeft={() => {
          setModalVisible({ show: false, message: null });
        }}
        handlerButtonRight={() => {
          setModalVisible({ show: false, message: null });
          navigation.navigate('BarCode');
        }}
      />
    </Container>
  );
};

export default ManualMonitoringScreen;
