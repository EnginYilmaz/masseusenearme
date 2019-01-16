import React from 'react';
import { TextInput, View, Text } from 'react-native';

const Minput = ({ label, value, onChangeText, placeholder, secureTextEntry }) => {
  const { inputStyle, labelStyle, containerStyle } = styles;

  return (
    <View style={containerStyle}>
      <Text style={labelStyle}>{label}</Text>
      <TextInput
        multiline={true}
        numberOfLines={4}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        autoCorrect={false}
        style={inputStyle}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = {
  inputStyle: {
    color: '#000',
    borderColor: 'black', 
    borderWidth: 4 , 
    borderRadius:15, 
    margin:10, 
    padding:10, 
    backgroundColor:'#ffee8f',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 18,
    lineHeight: 23,
    flex: 2
  },
  labelStyle: {
    fontSize: 18,
    paddingLeft: 20,
    flex: 1
  },
  containerStyle: {
    height: 80,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  }
};

export { Minput };
