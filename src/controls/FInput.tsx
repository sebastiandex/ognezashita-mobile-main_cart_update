import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

const FInput = ({ style, ...props }: any) => {
  return (
    <View style={styles.inputView}>
      <TextInput
        style={[styles.input, style]}
        {...props}
        placeholder={props.placeholder}
      />
    </View>
  );
};

export default FInput;

const styles = StyleSheet.create({
  input: {
    fontSize: 18,
    fontFamily: 'roboto-regular',
    // borderColor: 'red',
    // borderWidth: 1,
    padding: 10,
	paddingHorizontal: 10,
	paddingLeft: 16,
    width: '90%',
    backgroundColor: '#f5f5f5',
	borderRadius: 2,
	borderWidth: 1,
	borderColor: '#e0e0e0'
  },

  inputView: {
    marginBottom: 20,
    // borderColor: 'red',
    // borderWidth: 1,
    fontFamily: 'roboto-medium',
    alignItems: 'center',
    borderRadius: 4,
  },
});
