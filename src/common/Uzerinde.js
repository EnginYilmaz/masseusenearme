import React from 'react';
import { View } from 'react-native';

const Uzerinde = (props) => {
  return (
    <View style={styles.containerStyle}>
      {props.children}
    </View>
  );
};

const styles = {
  containerStyle: {
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    marginLeft: 80,
    marginRight: 5,
    marginTop: 150,
    position: 'absolute',
    alignItems: 'center',
    color: 'white',
    backgroundColor: 'white',
  }
};

export { Uzerinde };
