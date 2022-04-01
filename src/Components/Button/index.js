import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { Colors } from '../../styles/theme/colors';
import { TouchableButton, Text, Icon } from './styles';

const Button = ({
  onPress,
  primary,
  label,
  disabled,
  isLoading,
  size,
  icon,
  style,
  iconColor,
  colorText,
}) => {
  return (
    <TouchableButton
      underlayColor={primary ? Colors.activePrimary : Colors.activeButton}
      primary={primary}
      disabled={disabled}
      onPress={onPress}
      style={style}>
      {isLoading ? (
        <ActivityIndicator size={20} color={primary ? 'white' : Colors.primary} />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {icon && <Icon disabled={disabled} primary={primary} name={icon} iconColor={iconColor} />}
          <Text color={colorText} size={size} primary={primary} disabled={disabled}>
            {label}
          </Text>
        </View>
      )}
    </TouchableButton>
  );
};

export default Button;
