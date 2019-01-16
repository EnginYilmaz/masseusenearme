import React, { Component } from 'react'
import { Picker, ScrollView, AsyncStorage, Text, View, StyleSheet, Switch, Alert, StatusBar } from 'react-native'
import { Spinner, Button, ListButton, Card, CardYatay } from '../common';
import I18n from 'ex-react-native-i18n';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  map: {
    height: 400,
    width: 400,
  },
});

export default class Listtherapist extends Component {
  constructor(props) {
    super(props);

    this.lookupNearbyTherapists(this.props.latitude, this.props.longitude, this.props.distance);
  };
  state = {
    basari: false,
    listeler: [],
    ltd: this.props.latitude,
    lng: this.props.longitude,
  };

  async getKey(key) {
    if (this._mounted) {
      try {
        this.value = await AsyncStorage.getItem(key);
      } catch (error) {
        //////console.log("Error retrieving data" + error);
      }
    }
  }
  lookupNearbyTherapists(ltd, lng, distance) {
    ////Alert.alert(ltd);
    if (ltd == null) {
      ltd = this.state.ltd;
      lng = this.state.lng;
      //Alert.alert(ltd);
    }
    let myURL = 'https://www.masseusenearme.com/query_maps.php' + '?latitude=' + ltd + '&longitude=' + lng + '&distance=' + distance
    ////console.log(myURL);
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
          if (this._mounted) {
            this.setState({ listeler: responseJson });
          }
        }

      })
      .catch((error) => {
        console.error(error);
      });
  }
  componentWillUnmount() {
    this._mounted = false;
  }
  async saveKey(key, value) {
    if (this._mounted) {
      try {
        await AsyncStorage.setItem(key, value);
      } catch (error) {
        //////console.log("Error saving data" + error);
      }
    }
  }
  componentDidMount = () => {
    this._mounted = true;

    return fetch('https://www.masseusenearme.com/user_validate.php' + '?email=' + this.getKey('@massage:email') + '&password=' + this.getKey('@massage:password'), {
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
        if (this._mounted) {
          this.setState({ basari: responseJson });
        }
      })
      .catch((error) => {
        console.error(error);
      });

  }

  onPressList(index) {
    this.props.callbackMethod(index);
  }

  render() {
    //Alert.alert("latitude="+this.props.latitude)
    if (this.props.latitude && this.props.longitude) {
      return (
        <View style={{ width: '100%' }}>
          <View style={{ width: '100%' }}>
            <Text>{I18n.t('i18n_therapist_distance')}</Text>
            <Picker
              selectedValue={this.state.itemValue}
              style={{ height: 50, width: 200 }}
              onValueChange={(itemValue, itemIndex) => { this.setState({ itemValue }); this.lookupNearbyTherapists(this.props.latitude, this.props.longitude, itemValue) }}>
              <Picker.Item label="Max 2 Km" value="2" />
              <Picker.Item label="Max 10 Km" value="10" />
              <Picker.Item label="Max 30 Km" value="30" />
              <Picker.Item label="More than 30 Km" value="100000" />
            </Picker>
          </View>
          <View style={{ width: '98%' }}>
            <View key='xxxdddffdd2222' style={{ width: '98%' }}>
              <View style={{ height: 40, width: '95%' }}>
                <ListButton onPress={e => this.onPressList(296)}>
                  Administrator
                      </ListButton>
              </View>
            </View>
            <View>
                {Array.isArray(this.state.listeler) ?
                  this.state.listeler.map((liste) => (
                    <View key={liste.index} style={{ width: '98%' }}>
                      <View style={{ height: 40, width: '95%' }}>
                        <ListButton onPress={e => this.onPressList(liste.index)}>
                          {liste.title}
                        </ListButton>
                      </View>
                    </View>
                  ))
                  : <Spinner size="small" />
                }
            </View>
          </View>
        </View>
      );
    } else {
      return <Text>loading ...</Text>
    }
  }
}
