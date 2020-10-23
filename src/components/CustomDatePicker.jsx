import Icon from '@expo/vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../constants';
import { Text } from '../constants/styles';

const CustomDatePicker = ({ type, id, handleSelectedDate, ...rest }) => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState(type || 'date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    handleSelectedDate(id, currentDate);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.container}
      onPress={() => setShow(!show)}
    >
      <Icon
        size={20}
        name={mode == 'time' ? 'clock' : 'calendar'}
        style={{ marginRight: 10 }}
        color={colors.grayDark}
      />

      {mode == 'time' && (
        <Text fontSize="16px">
          {date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:
          {date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}
        </Text>
      )}
      {mode == 'date' && (
        <Text fontSize="16px">{date.toLocaleDateString()}</Text>
      )}
      {show && (
        <DateTimePicker
          mode={mode}
          value={date}
          is24Hour={true}
          display="default"
          testID="dateTimePicker"
          minimumDate={new Date()}
          onChange={onChange}
          {...rest}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 45,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderColor: colors.grayMedium,
  },
});

export default CustomDatePicker;
