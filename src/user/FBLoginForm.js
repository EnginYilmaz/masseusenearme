import React, { Component } from 'react';
import { Image, Alert, Text, AsyncStorage } from 'react-native';
import { Button, Card, CardDikey, Input, Spinner } from '../common';
import I18n from 'ex-react-native-i18n';
//import RNRestart from 'react-native-restart';
import { createStackNavigator } from 'react-navigation'; // Version can be specified in package.json
import { Constants, Location, Permissions } from 'expo';

class LoginForm extends Component {
  state = { email: '', password: '', error: '', loading: false };

  async saveOturum(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      ////////console.log("Error saving data" + error);
    }
  }

  async getOturum(key) {
    return (await AsyncStorage.getItem(key));
  }

  onButtonPress = () => {
    //Alert.alert(this.state.email)
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
        //Alert.alert("basarili");

        if (this._mounted) {
          this.setState({ error: responseJson.basari, loading: false });
        }
        if (responseJson.basari == true) {
          this.saveOturum('@massage:password', 'basarili');
          this.saveOturum('@massage:email', email);
          this.saveOturum('@massage:password', fbtoken);

          if (this._mounted) {
            //Actions.mapscreen();
            //Alert.alert(this.getOturum('@massage:email'))
            this.props.navigation.navigate('mapscreen', { selfEmail: email });
          }
        } else {
          if (this._mounted) {
            this.setState({ error: responseJson.basari });
          }
        }
      })
    //RNRestart.Restart();
    Expo.Util.reload()
  }
  componentDidMount() {
    this._mounted = true;
    const email = this.getOturum('@massage:email');
    const password = this.getOturum('@massage:fbtoken');
    this.setState({ email: email, password: password })
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
      <Button onPress={this.onButtonPress.bind(this)}>
        {I18n.t('i18n_login')}
      </Button>
    );
  }

  render() {
    return (
      <Card>
         <CardDikey>
          {this.renderButton()}
        </CardDikey>
      </Card>
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