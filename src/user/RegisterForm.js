import React, { Component } from 'react';
import { ScrollView, Alert, AsyncStorage, Text, Switch } from 'react-native';
import { Button, Card, CardDikey, Input, Spinner } from '../common';
import { createStackNavigator } from 'react-navigation'; // Version can be specified in package.json
import { Permissions, Notifications } from 'expo';
import I18n from 'ex-react-native-i18n';


class RegisterForm extends Component {
  async componentDidMount() {
    this._mounted = true;
  }
  state = { adsoyad: '', email: '', password: '', password_repeat: '', error: '', rol: false, loading: false, token: '' };

  constructor(props) {
    super(props);
    this.registerForPushNotificationsAsync();
  }

  async registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return
    }
    let token = await Notifications.getExpoPushTokenAsync();
    this.setState({ token: token });
  }

  componentWillUnmount() {
    this._mounted = false
  }

  onRegisterPress() {
    if (this.state.password != this.state.password_repeat) {
      this.setState({ error: 'Passwords does not match' });
    }
    if (this.state.email) {
      this.setState({ error: '', loading: true });
      myURL = 'https://www.masseusenearme.com/user_register_massage.php' + '?email=' + this.state.email + '&adsoyad=' + this.state.adsoyad + '&password=' + this.state.password + '&latitude=' + '' + this.props.latitude + '&longitude=' + this.props.longitude + '&password_repeat=' + this.state.password_repeat + '&rol=' + this.state.rol + '&token=' + this.state.token;
      this.saveKey('@massage:latitude', this.props.latitude);
      this.saveKey('@massage:longitude', this.props.longitude);
      return fetch(myURL, {
        method: "GET",
        mode: "cors",
        cache: "no-store",
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
            this.saveKey('@massage:email', email);
            this.saveKey('@massage:password', password);
            if (responseJson.basari == true) {
              this.props.navigation.navigate('mapscreen')
            } else {
              this.setState({ error: responseJson.basari });
            }
          }
        })
    } else {
    }
  }

  async getKey(key) {
    try {
      this.value = await AsyncStorage.getItem(key);
    } catch (error) {
      ////////console.log("Error retrieving data" + error);
    }
  }

  async saveKey(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      ////////console.log("Error saving data" + error);
    }
  }

  onLoginFail() {
    this.setState({ error: 'Authentication Failed', loading: false });
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
    ////Alert.alert("başarılı bir şekilde login oldu");
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size="small" />;
    }

    return (
      <Button onPress={this.onRegisterPress.bind(this)}>
        {I18n.t('i18n_register')}
      </Button>
    );
  }

  render() {
    //if (this.props.location.coords.latitude) {
    //Alert.alert(this.state.token)
    if (this.props.latitude && this.props.longitude) {
      return (
        <ScrollView>
          <Card>
            <CardDikey>
              <Input
                placeholder={I18n.t('i18n_full_name')}
                label={I18n.t('i18n_full_name')}
                value={this.state.adsoyad}
                onChangeText={adsoyad => this.setState({ adsoyad })}
              />
            </CardDikey>
            <CardDikey>
              <Input
                placeholder={I18n.t('i18n_email_placeholder')}
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
            <CardDikey>
              <Input
                secureTextEntry
                placeholder={I18n.t('i18n_password')}
                label={I18n.t('i18n_password_repeat')}
                value={this.state.password_repeat}
                onChangeText={password_repeat => this.setState({ password_repeat })}
              />
            </CardDikey>
            <CardDikey>
              <CardDikey>
                <Text style={styles.rolTextStyle}>
                  {I18n.t('i18n_massage_master')}
                </Text>
              </CardDikey>
              <Switch
                onValueChange={rol => this.setState({ rol })}
                value={this.state.rol} />
            </CardDikey>
            <Text style={styles.errorTextStyle}>
              {this.state.error}
            </Text>
            <CardDikey>
              {this.renderButton()}
            </CardDikey>
          </Card>
        </ScrollView>
      );
    } else {
      return (
        <Text>koordinat yok</Text>
      );
    }
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red'
  },
  rolTextStyle: {
    fontSize: 20,
    color: 'purple'
  }
};

export default RegisterForm;
