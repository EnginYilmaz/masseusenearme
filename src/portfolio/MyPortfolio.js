import React, { Component, } from 'react';
import { Picker, Alert, AsyncStorage, View, Text, Image, TouchableOpacity } from 'react-native';
import { Button, Card, CardDikey, Input, Minput, Spinner } from '../common';
import I18n from 'ex-react-native-i18n';
import { createStackNavigator, createDrawerNavigator, NavigationActions } from 'react-navigation'; // Version can be specified in package.json
import { Localization } from 'expo-localization';

class MyPortfolio extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    productname: '', resimgoruntule: true, resimurl: {}, email: '', error: '', rol: false,
    loading: false,
  };
  componentWillMount() {
    I18n.initAsync();

  }
  async componentDidMount() {
    this._mounted = true;
    const emailim = await AsyncStorage.getItem('@massage:email');
    this.setState({ email: emailim })
    //////console.log(emailim);
    ////Alert.alert(this.state.email)
    const { status } = await Expo.Permissions.askAsync(Expo.Permissions.CAMERA_ROLL);

    if (status === 'granted') {
    }
  }
  componentWillUnmount() {
    this._mounted = false
  }

  shotPhoto = async () => {
    //Actions.photoportfolio();
    this.props.navigation.navigate('photoportfolio')
  };

  onUploadPressed() {
    const { emailim, productname, productdescription } = this.state;

    ////Alert.alert(this.state.email + " " + this.state.productname + " " + this.state.productdescription);

    this.setState({ error: '', loading: true });
    myURL = 'https://www.masseusenearme.com/portfolio_update_put.php';
    const data = new FormData();
    data.append('email', this.state.email);
    data.append('productname', this.state.productname);
    data.append('productdescription', this.state.productdescription);
    //data.append('languagecode', Expo.Localization.getLocalizationAsync());
    if (this.props.navigation.getParam('photouri')) {
      data.append('photo', {
        uri: this.props.navigation.getParam('photouri'),
        type: 'image/jpeg', // or photo.type
        name: this.state.email + '_' + (Math.floor(Math.random() * 10000000)) + '.jpeg',
      });
    }
    ////Alert.alert(photoid+'');
    return fetch(myURL, {
      method: 'post',
      body: data,
      mode: "cors",
      cache: "no-cache",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log(responseJson.basari);
        this.setState({ error: responseJson.basari, loading: false });
        if (responseJson.basari == true) {
          //Alert.alert("kayit basarili");
        } else {
          this.setState({ error: responseJson.basari });
        }
      })
  }

  async saveKey(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      //////console.log("Error saving data" + error);
      return;
    }
  }
  renderUploadPortfolio() {
    if (this.state.loading == true) {
      return <Spinner size="small" />;
    } else {
      return (
        <Button onPress={this.onUploadPressed.bind(this)}>
          {I18n.t('i18n_newmassage')}
        </Button>
      );
    }
  }

  PhotoSection() {
    if (!this.props.navigation.getParam('photouri')) {
      return (
        <TouchableOpacity onPress={this.shotPhoto.bind(this)}>
          <Image style={{ height: 200, width: 150, borderRadius: 10, }} source={{ uri: 'https://www.masseusenearme.com/resimler/portfolio/' + this.state.email + '/' + (this.state.photoid) + '.jpeg' }} />
          <Text style={{ height: 50, width: 150, backgroundColor: 'green' }}>{I18n.t('i18n_shot_massage_photo')}</Text>
        </TouchableOpacity>
      );

    } else {
      return (
        <TouchableOpacity onPress={this.shotPhoto.bind(this)}>
          <Image style={{ height: 200, width: 150 }} source={{ uri: this.props.navigation.getParam('photouri') }} />
          <Text style={{ height: 50, width: 150, backgroundColor: 'orange' }}>{I18n.t('i18n_shot_massage_photo')}</Text>
        </TouchableOpacity>
      );
    }
  }

  render() {

    return (
      <View>
        <Card>
          <CardDikey>

          </CardDikey>
          <CardDikey>
            {this.PhotoSection()}
          </CardDikey>
          <CardDikey>
            <Picker
              label={I18n.t('i18n_massage_type')}
              selectedValue={this.state.productname}
              style={{ height: 50, width: 400 }}
              onValueChange={productname => this.setState({ productname })}>
              <Picker.Item label={I18n.t('i18n_sweedish_massage')} value="sweedish_massage" />
              <Picker.Item label={I18n.t('i18n_aromatherapy_massage')} value="aromatherapy_massage" />
              <Picker.Item label={I18n.t('i18n_hotstone_massage')} value="hotstone_massage" />
              <Picker.Item label={I18n.t('i18n_deeptissue_massage')} value="deeptissue_massage" />
              <Picker.Item label={I18n.t('i18n_shiatsu_massage')} value="shiatsu_massage" />
              <Picker.Item label={I18n.t('i18n_thai_massage')} value="thai_massage" />
              <Picker.Item label={I18n.t('i18n_reflexology')} value="reflexology" />
              <Picker.Item label={I18n.t('i18n_sports_massage')} value="sports_massage" />
              <Picker.Item label={I18n.t('i18n_other_massage')} value="other_massage" />
            </Picker>
          </CardDikey>
          <CardDikey>
            <Minput
              label={I18n.t('i18n_massage_details')}
              value={this.state.productdescription}
              onChangeText={productdescription => this.setState({ productdescription })}
            />
          </CardDikey>
          <CardDikey>
            {this.renderUploadPortfolio()}
          </CardDikey>
        </Card>
        <Text style={styles.errorTextStyle}>
          {this.state.error}
        </Text>
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
  },
  icon: {
    width: 24,
    height: 24,
  },
};

export default MyPortfolio;