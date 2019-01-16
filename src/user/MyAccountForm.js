import React, { Component, } from 'react';
import { Picker, ScrollView, Platform, StatusBar, AsyncStorage, View, Text, Alert, Switch, CameraRoll, Image, TouchableOpacity, Navigator } from 'react-native';
import { Button, Card, CardDikey, Minput, Input, Spinner } from '../common';
import I18n from 'ex-react-native-i18n';
//import RNRestart from 'react-native-restart'; 
import { createStackNavigator } from 'react-navigation'; // Version can be specified in package.json
import NavigationService from '../../NavigationService.js';
import { Constants, Location, Permissions } from 'expo';

class MyAccountForm extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    resimgoruntule: true, adsoyad: '', email: '', password: '', password_repeat: '', error: '', rol: false, picture: { uri: 'https://www.masseusenearme.com/resimler/resimyok.png' },
    guncelle_loading: false, phoneverification_loading: false,coords: null, loggedIn: false, cv: '', gender: null, email_notification: null, email_advertising: null, push_notification: null,
  };
  componentWillMount() {
    I18n.initAsync();
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }
  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    ////Alert.alert(location+'')
    this.setState({ location });
  };

  async componentDidMount() {
    this._mounted = true;
    if (this._mounted) {
      const emailim = await AsyncStorage.getItem('@massage:email');
      ////////console.log(emailim);
      this.setState({ error: '' });

      myURL = 'https://www.masseusenearme.com/user_update_get.php' + '?email=' + emailim;
      ////Alert.alert("emailim=" + emailim);
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

            let rolum = false;

            if (responseJson.rol == "terapist") {
              rolum = true;
            }
            this.setState({
              adsoyad: responseJson.adsoyad,
              email: responseJson.email,
              password: responseJson.password,
              password_repeat: responseJson.password_repeat,
              rol: rolum,
              gender: responseJson.gender,
              email_notification: responseJson.email_notification,
              email_advertising: responseJson.email_advertising,
              push_notification: responseJson.push_notification,
              cv: responseJson.cv,
              guncelle_loading: false
            })
          }
        })
    }
  }

  componentWillUnmount() {
    this._mounted = false
  }

  async saveOturum(key, value) {
    if (this._mounted) {
      try {
        await AsyncStorage.setItem(key, value);
      } catch (error) {
        ////////console.log("Error saving data" + error);
      }
    }
  }

  shotPhoto = async () => {
    if (this._mounted) {
      //Actions.photograph();
      ////Alert.alert("selam")
      this.props.navigation.navigate('photograph')
    }
  };

  onGuncellePress() {
    if (this._mounted) {
      this.setState({ guncelle_loading: true })
      const { adsoyad, email, password, password_repeat, rol, cv } = this.state;
      if (this.state.password != this.state.password_repeat) {
        this.setState({ error: 'Şifreler aynı değil' });
      } else {
        this.saveOturum('@massage:serviceprovider', rol);
        this.setState({ error: '', guncelle_loading: true });
        myURL = 'https://www.masseusenearme.com/user_update_put.php';
        const data = new FormData();
        data.append('email', this.state.email);
        data.append('adsoyad', this.state.adsoyad);
        data.append('password', password);
        data.append('password_repeat', this.state.password_repeat);
        data.append('latitude', this.state.location.coords.latitude);
        data.append('longitude', this.state.location.coords.longitude);
        data.append('rol', this.state.rol);
        data.append('gender', this.state.gender);
        data.append('email_notification', this.state.email_notification);
        data.append('email_advertising', this.state.email_advertising);
        data.append('push_notification', this.state.push_notification);
        data.append('cv', this.state.cv);
        if (this.props.navigation.getParam('photouri')) {
          data.append('photo', {
            uri: this.props.navigation.getParam('photouri'),
            type: 'image/jpeg', // or photo.type
            name: email + '.jpeg',
          });
        }
        return fetch(myURL, {
          method: 'post',
          body: data
        })
          .then((response) => response.json())
          .then((responseJson) => {
            this.setState({ error: responseJson.basari, guncelle_loading: false });
            if (responseJson.basari == true) {
              ////Alert.alert("kayit basarili");
            } else {
              this.setState({ error: responseJson.basari });
            }
          })
      }
    }
  }
  onCikisPress() {
    if (this._mounted) {
      this.saveOturum('@massage:oturum', 'basarisiz');
      this.saveKey('@massage:email', '');
      //RNRestart.Restart();
      //Actions.user();
      //this.props.navigation.navigate('user')
      //Expo.Util.reload()
      NavigationService.navigate('Auth');

    }
  }
  onPhoneValidatePress() {
    this.props.navigation.navigate('phoneverificationandroid', {email:this.state.email});
  }
  async getKey(key) {
    if (this._mounted) {
      try {
        this.value = await AsyncStorage.getItem(key);
      } catch (error) {
        ////////console.log("Error retrieving data" + error);
      }
    }
  }
  async saveKey(key, value) {
    if (this._mounted) {
      try {
        await AsyncStorage.setItem(key, value);
      } catch (error) {
        ////////console.log("Error saving data" + error);
      }
    }
  }
  renderGuncelleButton() {
    if (this._mounted) {
      if (this.state.guncelle_loading) {
        return <Spinner size="small" />;
      } else {
        return (
          <Button onPress={this.onGuncellePress.bind(this)}>
            {I18n.t('i18n_update')}
          </Button>
        );
      }
    }
  }
  renderPhoneVerificationButton() {
    if (this._mounted) {
      if (this.state.phoneverification_loading) {
        return <Spinner size="small" />;
      } else {
        return (
          <Button onPress={this.onPhoneValidatePress.bind(this)}>
            {I18n.t('i18n_phoneverification')}
          </Button>
        );
      }
    }
  }
  renderLogoutButton() {
    if (this._mounted) {
      if (this.state.logout_loading) {
        return <Spinner size="small" />;
      } else {
        return (
          <Button onPress={this.onCikisPress.bind(this)}>
            {I18n.t('i18n_logout')}
          </Button>
        );
      }
    }
  }

  PhotoSection() {
    if (this._mounted) {
      ////Alert.alert(this.props.navigation.getParam('userpicture'))
      if (!this.props.navigation.getParam('photouri')) {
        return (
          <TouchableOpacity onPress={this.shotPhoto.bind(this)}>
            <Image style={{ height: 200, width: 150 }} source={{ uri: 'https://www.masseusenearme.com/resimler/kullaniciresmi/' + this.state.email + '.jpeg' }} />
            <Text style={{ height: 50, width: 150, backgroundColor: 'green' }}>{I18n.t('i18n_shot_your_photo')}</Text>
          </TouchableOpacity>
        );

      } else {
        //////console.log(this.props.navigation.getParam('userpicture'))
        return (
          <TouchableOpacity onPress={this.shotPhoto.bind(this)}>
            <Image style={{ height: 200, width: 150 }} source={{ uri: this.props.navigation.getParam('photouri') }} />
            <Text style={{ height: 50, width: 150, backgroundColor: 'orange' }}>{I18n.t('i18n_shot_your_photo')}</Text>
          </TouchableOpacity>
        );
      }
    }
  }

  render() {
    ////Alert.alert(this.props.navigation.getParam('userpicture', 'Peter'))
    let email_n = false;
    if(this.state.email_notification == 1 ) {
      email_n = true;
    }
    let email_a = false; 
    if(this.state.email_advertising == 1 ) {
      email_a = true;
    }
    let push_n = false;
    if(this.state.push_notification == 1 ) {
      push_n = true;
    }
    return (
      <View>
        <ScrollView>
          <Card>
            {this.PhotoSection()}
            <CardDikey>
              <Input
                label={I18n.t('i18n_full_name')}
                value={this.state.adsoyad}
                onChangeText={adsoyad => this.setState({ adsoyad })}
              />
            </CardDikey>
            <CardDikey>
              <Input
                label={I18n.t('i18n_email')}
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
              />
            </CardDikey>
            <CardDikey>
              <Input
                secureTextEntry
                label={I18n.t('i18n_password')}
                value={this.state.password}
                onChangeText={password => this.setState({ password })}
              />
            </CardDikey>
            <CardDikey>
              <Input
                secureTextEntry
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
            <CardDikey>
              <CardDikey>
                <Text>{I18n.t('i18n_gender')}</Text>
              </CardDikey>
              <Picker
                selectedValue={this.state.gender}
                style={{ height: 50, width: 200 }}
                onValueChange={(gender, itemIndex) => { this.setState({ gender }); }}>
                <Picker.Item label={I18n.t('i18n_gender_na')} value="na" />
                <Picker.Item label={I18n.t('i18n_gender_male')} value="male" />
                <Picker.Item label={I18n.t('i18n_gender_female')} value="female" />
                <Picker.Item label={I18n.t('i18n_gender_other')} value="other" />
              </Picker>
            </CardDikey>
            <CardDikey>
              <Minput
                label={I18n.t('i18n_cv')}
                value={this.state.cv}
                onChangeText={cv => this.setState({ cv })}
              />
            </CardDikey>
            <CardDikey>
              <CardDikey>
                <Text style={styles.rolTextStyle}>
                  {I18n.t('i18n_email_notification')}
                </Text>
              </CardDikey>
              <Switch
                onValueChange={email_notification => this.setState({ email_notification })}
                value={email_n} />
            </CardDikey>
            <CardDikey>
              <CardDikey>
                <Text style={styles.rolTextStyle}>
                  {I18n.t('i18n_email_advertising')}
                </Text>
              </CardDikey>
              <Switch
                onValueChange={email_advertising => this.setState({ email_advertising })}
                value={email_a} />
            </CardDikey>
            <CardDikey>
              <CardDikey>
                <Text style={styles.rolTextStyle}>
                  {I18n.t('i18n_push_notification')}
                </Text>
              </CardDikey>
              <Switch
                onValueChange={push_notification => this.setState({ push_notification })}
                value={push_n} />
            </CardDikey>
            <Text style={styles.errorTextStyle}>
              {this.state.error}
            </Text>
            <CardDikey>
              {this.renderGuncelleButton()}
            </CardDikey>
            <CardDikey>
              {this.renderPhoneVerificationButton()}
            </CardDikey>
            <CardDikey>
              {this.renderLogoutButton()}
            </CardDikey>
          </Card >
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
  },
  rolTextStyle: {
    fontSize: 20,
    color: 'purple'
  }
};

export default MyAccountForm;
