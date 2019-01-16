import React, { Component } from 'react';
import { Picker, ScrollView, TouchableOpacity, TouchableHighlight, Modal, Alert, Platform, Text, Image, AsyncStorage, View, StyleSheet } from 'react-native';
import Listtherapist from './Listtherapist.js';
import ShowProfile from './ShowProfile.js';
import ShowPortfolio from './ShowPortfolio.js';
import { Constants, Location, Permissions } from 'expo';
import { Button, Input, Card, CardDikey } from '../common';
import I18n from 'ex-react-native-i18n';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  map: {
    height: '30%',
    width: '95%',
    flex: 1,
  },
  profile: {
    height: '20%',
    width: '100%',
    flex: 1,
    flexDirection: 'column'
  },
  tub: {
    height: 300,
    width: 400,
    flex: 1,
  },
});

class Listscreen extends Component {
  state = {
    lat: null,
    lng: null,
    adsoyad: I18n.t('i18n_therapist_name_placeholder'),
    email: null,
    selfEmail: null,
  }
  constructor(props) {
    super(props);
    //this.AppContainer.alarm();

  }
  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {

      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});

    if (location.coords.latitude && location.coords.longitude) {
      this.setState({
        lat: (location.coords.latitude).toString(),
        lng: (location.coords.longitude).toString(),
      });
    } else {

    }

  };
  async componentDidMount() {
    this._mounted = true;
  }

  componentWillMount() {
    this.props.navigation.setParams({ drawerLabelText: 'deneme' });
    this._getLocationAsync();
    AsyncStorage.getItem('@massage:email')
      .then((email) => {
        this.setState({
          selfEmail: email,
        });
        //////Alert.//Alert(email)
      });


    AsyncStorage.getItem('@massage:latitude')
      .then((latitude) => {
        this.setState({
          lat: latitude,
        });
      });
    AsyncStorage.getItem('@massage:longitude')
      .then((longitude) => {
        this.setState({
          lng: longitude,
        });
      });
    //Alert.//Alert(this.state.lng);
  }
  componentWillUnmount() {
    this._mounted = false
  }

  callbackMethod = (index) => {
    return fetch('https://www.masseusenearme.com/query_map_user.php' + '?uid=' + index, {
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
          if (this._mounted) {
            this.setState({
              adsoyad: responseJson.adsoyad,
              email: responseJson.email,
              uid: responseJson.uid
            });
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  render() {
    if (this.state.lat != null) {
      return (
        <ScrollView>
          <Card style={{ width: '100%' }}> 
            <CardDikey>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('fullportfolio', { therapist_email: this.state.email, patient_email: this.state.selfEmail })}>
                <ShowProfile
                  propsnav={this.props.navigation}
                  style={styles.profile}
                  adsoyad={this.state.adsoyad}
                  email={this.state.email}
                />
                <ShowPortfolio key={this.state.uid} style={styles.tub} email={this.state.email} limit='3' />
              </TouchableOpacity>
            </CardDikey>
            <CardDikey style={{ width: '100%' }}>
              <Listtherapist latitude={this.state.lat} distance={this.state.distance} longitude={this.state.lng} callbackMethod={this.callbackMethod} />
            </CardDikey>
          </Card>
        </ScrollView>

      );
    } else {
      return (
        <Text>Loading...</Text>
      );
    }
  }
}
export default Listscreen;
