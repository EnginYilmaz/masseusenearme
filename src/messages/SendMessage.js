import React, { Component } from 'react'
import { Alert, AsyncStorage, Text, View, StatusBar, Image } from 'react-native'
import { Spinner, Button, Card, CardDikey, Minput } from '../common';
import I18n from 'ex-react-native-i18n';
import { createStackNavigator } from 'react-navigation'; // Version can be specified in package.json
import { Permissions, Notifications } from 'expo';

I18n.initAsync();

export default class SendMessage extends Component {
  static navigationOptions = {
    drawerLabel: null,
  }
  state = {
    adsoyad: null,
    eposta: null,
    loadingSendingMessage: false,
  };
  constructor(props) {
    super(props);
    //this.getNotificationState();
  }
  async getKey(key) {
    try {
      this.value = await AsyncStorage.getItem(key);
    } catch (error) {
      ////////console.log("Error retrieving data" + error);
    }
  }
  async componentDidMount() {
    this._mounted = true;
    const emailim = await AsyncStorage.getItem('@massage:email');
    this.setState({ eposta: emailim });
  }
  componentWillUnmount() {
    this._mounted = false
  }

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
    // POST the token to your backend server from where you can retrieve it to send push notifications.
    let notificationURL = 'https://www.masseusenearme.com/send_notification.php' + '?message=' + this.state.bodymessage + '&senderid=' + this.state.eposta + '&receipentid=' + this.props.navigation.getParam('email', 'Peter');
    return fetch(notificationURL, {
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
    });
  }

  onMessagePress() {
    this.registerForPushNotificationsAsync();

    this.setState({ error: '', loading: true, loadingSendingMessage: true });
    myURL = 'https://www.masseusenearme.com/send_message.php' + '?message=' + this.state.bodymessage + '&senderid=' + this.state.eposta + '&receipentid=' + this.props.navigation.getParam('email', 'Peter');
    //console.log(myURL)
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
          this.setState({ error: responseJson.basari });
        }
        if (responseJson.basari == true) {
          if (this._mounted) {
            this.setState({ error: "Successfully sent message", loadingSendingMessage: false })
          }
        } else {
          if (this._mounted) {
            this.setState({ error: responseJson.basari })
          }
        }
      })
  }

  renderSMButton() {
    if (this.state.loadingSendingMessage) {
      return <Spinner size="small" />;
    } else {
      return (
        <Button onPress={this.onMessagePress.bind(this)}>
          {I18n.t('i18n_send_message')}
        </Button>
      );
    }
  }

  render() {
    const { navigate } = this.props.navigation;

    let pic = {
      uri: 'https://www.masseusenearme.com/resimler/kullaniciresmi/' + this.props.navigation.getParam('email', 'peter') + '.jpeg',
    };

    ////Alert.alert(this.props.email);
    return (
      <Card>
        <View>
          <Image source={pic}
            style={{ width: 100, height: 150 }}
            defaultSource={require("../../assets/sample_therapist.png")}
          />
          <Text>{this.props.adsoyad}</Text>
          <CardDikey>
            <Minput
              label={I18n.t('i18n_message_body')}
              value={this.state.bodymessage}
              onChangeText={bodymessage => this.setState({ bodymessage })}
            />
          </CardDikey>
          <CardDikey>
            {this.renderSMButton()}
          </CardDikey>
          <CardDikey>
            <Text style={styles.errorTextStyle}>
              {this.state.error}
            </Text>
          </CardDikey>
        </View>
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


//---------------------------------------------------------------------------------------------------------






