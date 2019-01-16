import React, { Component } from 'react';
import { Alert, AsyncStorage, Text, Switch } from 'react-native';
import { Button, Card, CardDikey, Input, Spinner } from '../common';
import { createStackNavigator } from 'react-navigation';
import { Permissions, Notifications } from 'expo';
import I18n from 'ex-react-native-i18n';
//import anauygulama from '../../App.js';
import NavigationService from '../../NavigationService.js';
//import App from '../../App.js';

class FBRegisterForm extends Component {
  async componentDidMount() {
    this._mounted = true;
  }
  state = { id: '', adsoyad: '', email: '', password: '', password_repeat: '', error: '', rol: false, loading: false, fbtoken: '', token: '' };

  constructor(props) {
    super(props);
    this.registerForPushNotificationsAsync();
    this.FBregister();
  }

  //2notification
  async registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    this.setState({ token: token });
  }
  componentWillUnmount() {
    this._mounted = false
  }

  async componentDidMount() {
    this._mounted = true;
  }

  async saveOturum(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      ////////console.log("Error saving data" + error);
    }
  }
  async FBregister() {
    try {
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Expo.Facebook.logInWithReadPermissionsAsync('315346752417508', {
        permissions: ['public_profile'],
        // FB development mode app id = 294942651007586
      });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        const responseJson = await response.json();
        ////console.log(responseJson);
        ////console.log(expires);
        const name = responseJson.name;
        const id = responseJson.id;
        ////Alert.alert("id="+id);
        this.setState({
          fbtoken: token,
          adsoyad: name,
          id: id,
        });
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      //Alert.alert(`Facebook Login Error: ${message}`);
      return 0;
    }
  }


  onButtonPress() {
    //NavigationService.navigate('ChatScreen', { userName: 'Lucy' });
    //NavigationService.setTopLevelNavigator('therapistRootStack');
    ////Alert.alert(''+ this.props.longitude);

    if (this.state.id) {
      this.setState({ error: '', loading: true });
      myURL = 'https://www.masseusenearme.com/fbuser_register.php' + '?email=' + this.state.id + '&passwd=' + this.state.fbtoken + '&name=' + this.state.adsoyad + '&latitude=' + '' + this.props.latitude + '&longitude=' + this.props.longitude + '&rol=' + this.state.rol + '&token=' + this.state.token;
      //////console.log(myURL);
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
            if (responseJson.basari == "This user already registered") {
              this.loginFB();
            } else {
              this.setState({ error: responseJson.basari });
            }
          }
        })
    }
  }
  loginFB() {
    ////Alert.alert(this.state.email)
    const { email, password } = this.state;
    if (this._mounted) {
      this.setState({ error: '', loading: true });
    }
    myURL = 'https://www.masseusenearme.com/user_validate.php' + '?email=' + this.state.id + '&password=' + this.state.fbtoken;
    ////console.log(myURL);
    fetch(myURL, {
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
        ////Alert.alert("basarili");

        if (this._mounted) {
          this.setState({ error: responseJson.basari, loading: false });
        }
        if (responseJson.basari == true) {
          this.saveOturum('@massage:oturum', 'basarili');
          this.saveOturum('@massage:email', this.state.id);
          this.saveOturum('@massage:password', this.state.fbtoken);
          if (this.state.id && this.state.fbtoken) {
            if (responseJson.rol == "terapist") {
              NavigationService.navigate('App_therapist');
            } else if (responseJson.rol == "musteri") {
              NavigationService.navigate('App_patient');
            }
          }
          if (this._mounted) {
            //Actions.mapscreen();
            ////Alert.alert(this.getOturum('@massage:email'))
            //this.props.navigation.navigate('mapscreen', { selfEmail: email });
          }
        } else {
          if (this._mounted) {
            this.setState({ error: responseJson.basari });
          }
        }
      })
  }
  async getKey(key) {
    try {
      this.value = await AsyncStorage.getItem(key);
    } catch (error) {
      ////////console.log("Error retrieving data" + error);
      //Alert.alert("Error retrieving data");
      return 0;
    }
  }

  async saveKey(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      //Alert.alert("Error setting data");
      return 0;
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
      <Button onPress={this.onButtonPress.bind(this)}>
        {I18n.t('i18n_fb_register_login')}
      </Button>
    );
  }

  render() {
    return (
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
          <Text style={styles.rolTextStyle}>
            {I18n.t('i18n_massage_master')}
          </Text>
        </CardDikey>
        <CardDikey>
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
    );
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

export default FBRegisterForm;