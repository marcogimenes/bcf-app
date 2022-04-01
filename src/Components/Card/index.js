import React, { useEffect } from 'react';

import { BackHandler, TouchableHighlight, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../styles/theme/colors';
import {
  CardView,
  HeaderCard,
  TitleCard,
  Options,
  BodyCard,
  TextCard,
  ButtonOption,
} from './styles';

function Card({ title, content, options, onDelete, onUpdate, active, onPress, onBlur }) {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBlur);

    return () => backHandler.remove();
  }, []);

  return (
    <View>
      <CardView onPress={onBlur} active={active}>
        <>
          <HeaderCard>
            <TitleCard>{title}</TitleCard>
            {options && (
              <TouchableHighlight
                underlayColor={Colors.activeButton}
                style={{ borderRadius: 50 }}
                onPress={onPress}>
                <Icon name="dots-vertical" size={25} color={Colors.primary} />
              </TouchableHighlight>
            )}
          </HeaderCard>

          <BodyCard>
            {content.map((item) => (
              <TextCard key={item.label}>
                {item.label}: {item.value}
              </TextCard>
            ))}
          </BodyCard>
        </>
      </CardView>
      {active && (
        <Options>
          <ButtonOption
            onPress={onDelete}
            size={15}
            icon="delete-outline"
            label="Excluir Local"
            iconColor={Colors.primary}
            colorText="#4f4f4f"
          />
          <ButtonOption
            iconColor={Colors.primary}
            colorText="#4f4f4f"
            size={15}
            onPress={onUpdate}
            icon="pencil-outline"
            label="Editar Local"
          />
        </Options>
      )}
    </View>
  );
}

export default Card;
