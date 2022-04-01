import React, { useState, useEffect } from 'react';

import { ActivityIndicator, TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Colors } from '../../styles/theme/colors';

import { TextField, ViewInput } from './styles';

const InputField = ({
  value,
  onChangeText,
  onBlur,
  isValid = true,
  disabled,
  placeholder,
  isLoading,
  onFocus,
  showSoftInputOnFocus,
  maxLength,
  autoCapitalize,
  search,
}) => {
  const [focused, setFocus] = useState(false);
  const [editableState, setEditable] = useState(false);

  useEffect(() => {
    if (disabled) {
      setEditable(false);
    } else {
      setEditable(true);
    }
  }, [disabled]);

  return (
    <ViewInput isValid={isValid} disabled={disabled}>
      {search &&
        (isLoading ? (
          <ActivityIndicator style={{ marginHorizontal: 5 }} size="small" color={Colors.primary} />
        ) : (
          <Icon style={{ marginHorizontal: 5 }} name="magnify" size={25} color={Colors.primary} />
        ))}

      <TextField
        autoCapitalize={autoCapitalize}
        value={value}
        maxLength={maxLength}
        onChangeText={onChangeText}
        onBlur={() => {
          if (onBlur) {
            onBlur();
          }
          setFocus(false);
        }}
        showSoftInputOnFocus={showSoftInputOnFocus}
        onFocus={() => {
          if (onFocus) {
            onFocus();
          }
          setFocus(true);
        }}
        disabled={disabled}
        editable={editableState}
        selectTextOnFocus={!disabled}
        placeholder={search ? 'Pesquise' : placeholder}
      />
      {focused && (
        <TouchableOpacity
          onPress={() => {
            onChangeText('');
          }}>
          <Icon name="close-circle" size={25} color={Colors.secondary} />
        </TouchableOpacity>
      )}
    </ViewInput>
  );
};

export default InputField;
