import React, { useState, useEffect } from 'react';

import { Modal, View } from 'react-native';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import { Container, Text, Icon, BlurPressable, BodySelect, Label, ItemSeleted } from './styles';
import { Colors } from '../../styles/theme/colors';

const SelectItem = ({ items, itemActive, label, onSelect }) => {
  const [seletedIndex, setIndexSeleted] = useState(0);
  const [showInput, setInputState] = useState(false);
  const onSelectHandler = (value, index) => {
    setIndexSeleted(index);
    onSelect(value, index);
    setTimeout(() => {
      setInputState(false);
    }, 450);
  };

  useEffect(() => {
    if (itemActive.value) {
      const index = items.findIndex((item) => {
        return item.value === itemActive.value;
      });
      if (index >= 0) {
        setIndexSeleted(index);
      }
    }
  }, [itemActive]);

  return (
    <Container underlayColor={Colors.activeButton} onPress={() => setInputState(true)}>
      <>
        <View>
          <Text>{label}:</Text>
          <ItemSeleted>{itemActive.label || items[seletedIndex].label}</ItemSeleted>
        </View>
        <Modal
          animationType="slide"
          transparent
          visible={showInput}
          onRequestClose={() => setInputState(false)}>
          <BlurPressable onPress={() => setInputState(false)} style={{}}>
            <BodySelect>
              <>
                <Label>{label}</Label>
                <RadioForm animation>
                  {items.map((obj, i) => (
                    <RadioButton labelHorizontal key={obj.value} style={{ marginTop: 15 }}>
                      <RadioButtonInput
                        obj={obj}
                        index={i}
                        isSelected={i === seletedIndex}
                        onPress={(value) => onSelectHandler(value, i)}
                        borderWidth={1.5}
                        buttonInnerColor={Colors.primary}
                        buttonSize={10}
                        buttonOuterSize={20}
                        buttonStyle={{
                          borderColor: i === seletedIndex ? Colors.primary : Colors.secondary,
                        }}
                        buttonWrapStyle={{ marginLeft: 0 }}
                      />
                      <RadioButtonLabel
                        obj={obj}
                        index={i}
                        labelHorizontal
                        onPress={(value) => onSelectHandler(value, i)}
                        labelStyle={{ fontSize: 17, color: '#000' }}
                        labelWrapStyle={{}}
                      />
                    </RadioButton>
                  ))}
                </RadioForm>
              </>
            </BodySelect>
          </BlurPressable>
        </Modal>
        <Icon name="chevron-down" />
      </>
    </Container>
  );
};

export default SelectItem;
