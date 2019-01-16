import React, { Component } from 'react'
import { Image, AsyncStorage, Text, View, StyleSheet, StatusBar, ScrollView } from 'react-native'
import { Card, CardDikey, Spinner } from '../common';
import I18n from 'ex-react-native-i18n';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  tub: {

  },
});
I18n.initAsync();

export default class GetMessage extends Component {

  state = {
    email: null,
    messages: [],
  };
  async componentDidMount() {
    this._mounted = true;

    const emailim = await AsyncStorage.getItem('@massage:email');
    ////////console.log(emailim);
    if (this._mounted) {
      this.setState({ error: '', loading: true });
    }
    return fetch('https://www.masseusenearme.com/get_message.php' + '?email=' + emailim, {
      method: "GET",
      mode: "cors",
      cache: "no-store",
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
          this.setState({
            messages: responseJson
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  componentWillUnmount() {
    this._mounted = false
  }
  render() {
    if (this.state.messages) {
      const yok = '<View><Text>No, message found</Text></View>';
      return (
        <View style={styles.container}>
          <ScrollView>
            <Card>
              <View style={styles.tub}>
                {
                  Array.isArray(this.state.messages) ?
                    this.state.messages.map((message, index) => (
                      <CardDikey key={index}>
                        <Text key={'tarih' + message.tarih}>{message.tarih} - </Text>
                        <Text key={'name' + message.tarih} >{message.name} - </Text>
                        <Text key={'mesaj' + message.tarih} >{message.mesaj} </Text>
                      </CardDikey>
                    ))
                    : <Spinner size="small" />
                }
              </View>
            </Card>
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View>
          <Text>{I18n.t('i18n_nomessage_inbox')}</Text>
        </View>
      );
    }
  }
}