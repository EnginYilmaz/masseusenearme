import React, { Component } from 'react';
import { Text, Platform, Image, AsyncStorage, View } from 'react-native';
import RegisterForm from './RegisterForm.js';
import I18n from 'ex-react-native-i18n';
import { Constants, Location, Permissions } from 'expo';
import { Button, Card, CardDikey, Input, Spinner } from '../common';

export default class Plainregister extends Component {
  constructor(props) {
    super(props);
    
  }

  
  state = {
    location: null,
    errorMessage: null,
  };

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }
        
  onPressAddress() {
    myURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + this.state.address + '&key=AIzaSyCk8PGxIOYtUr0aQ8fErOSXRUYcPF9_XrU';
    ////console.log(myURL)
    return fetch(myURL, {
      method: "GET",
      mode: "cors",
      cache: "force-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Encoding": "zlib",
      },
      redirect: "follow",
      referrer: "no-referrer",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson) {
          this.setState({
            latitude: responseJson.results[0].geometry.location.lat,
            longitude: responseJson.results[0].geometry.location.lng,
          });
        }

      })
      .catch((error) => {
        console.error(error);
      });
  }
       
  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ latitude: location.coords.latitude, longitude: location.coords.longitude });
  };

  render() {
    if (this.state.latitude && this.state.longitude) {
      return <RegisterForm latitude={this.state.latitude} longitude={this.state.longitude} />;
    } else {
      return (
        <View style={{ height: '30%', width: '100%' }}>
          <Text>Sorry but we could'nt dedect your location please provide with your address</Text>
          <Input
            placeholder={I18n.t('i18n_your_address')}
            label={I18n.t('i18n_your_address')}
            value={this.state.address}
            onChangeText={address => this.setState({ address })}
          />
          <Button onPress={this.onPressAddress.bind(this)}>
            Find my Geo Location
          </Button>
        </View>
      );
    }
  }
}
