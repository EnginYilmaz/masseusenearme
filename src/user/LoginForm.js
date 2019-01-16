import React, { Component } from 'react';
import { View, ScrollView, Image, Alert, Text, AsyncStorage } from 'react-native';
import { Button, Card, CardDikey, Input, Spinner } from '../common';
import I18n from 'ex-react-native-i18n';
import { createStackNavigator } from 'react-navigation';
import { Constants, Location, Permissions } from 'expo';
import NavigationService from '../../NavigationService.js';
class LoginForm extends Component {
  state = { email: '', password: '', error: '', loading: false };

  async saveOturum(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      ////////console.log("Error saving data" + error);
    }
  }
    async getKey(key) {
    try {
      this.value = await AsyncStorage.getItem(key);
    } catch (error) {
      ////////console.log("Error retrieving data" + error);
    }
  }

  onLoginPress = () => {
    const { email, password } = this.state;
    if (this._mounted) {
      this.setState({ error: '', loading: true });
    }
    myURL = 'https://www.masseusenearme.com/user_validate.php' + '?email=' + email + '&password=' + password;
    return fetch(myURL, {
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
          this.setState({ error: responseJson.basari, loading: false });
        }
        if (responseJson.basari == true) {
          this.saveOturum('@massage:oturum', 'basarili');
          this.saveOturum('@massage:email', email);
          //Alert.alert("terapist")
          if (responseJson.rol == "terapist") {
            NavigationService.navigate('App_therapist');
          } else if (responseJson.rol == "musteri") {
            NavigationService.navigate('App_patient');
          }
          if (this._mounted) {
            //Actions.mapscreen();
            //Alert.alert("email")
            this.props.navigation.navigate('mapscreen', { selfEmail: email });
          }
        } else {
          if (this._mounted) {
            this.setState({ error: responseJson.basari });
          }
        }
      })
  }
  componentDidMount() {
    this._mounted = true;
  }
  componentWillUnmount() {
    this._mounted = false;
  }
  onLoginFail() {
    if (this._mounted) {
      this.setState({ error: 'Oturum açma başarısız', loading: false });
    }
  }

  onLoginSuccess() {
    if (this._mounted) {
      this.setState({
        email: '',
        password: '',
        loading: false,
        error: ''
      });
    }
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size="small" />;
    }
    return (
      <Button onPress={this.onLoginPress.bind(this)}>
        {I18n.t('i18n_login')}
      </Button>
    );
  }

  render() {
    return (
      <View>
      <ScrollView>
        <Card>
          <CardDikey>
            <Input
              placeholder={I18n.t('i18n_email')}
              label={I18n.t('i18n_email')}
              value={this.state.email}
              onChangeText={email => this.setState({ email })}
            />
          </CardDikey>
          <CardDikey>
            <Input
              secureTextEntry
              placeholder={I18n.t('i18n_password')}
              label={I18n.t('i18n_password')}
              value={this.state.password}
              onChangeText={password => this.setState({ password })}
            />
          </CardDikey>
          <Text style={styles.errorTextStyle}>
            {this.state.error}
          </Text>
          <CardDikey>
            {this.renderButton()}
          </CardDikey>
          <CardDikey>
            <Button onPress={() => this.props.navigation.navigate('plainregister')}>
              {I18n.t('i18n_register')}
            </Button>
          </CardDikey>
          <CardDikey>
            <Button onPress={() => this.props.navigation.navigate('fbregister')}>
              {I18n.t('i18n_login_fb')}
            </Button>
          </CardDikey>
        </Card>
      </ScrollView>
      </View>
    );
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red'
  }
};

export default LoginForm;
