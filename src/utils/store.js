import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (erro) {
    console.warn(erro);
  }
};

const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (erro) {
    console.warn(erro);
  }
  return null;
};
const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (erro) {}
};

export { getData, storeData, removeData };
