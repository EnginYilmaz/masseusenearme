import React, { Component } from 'react';
import { Button, Image, StyleSheet, ActivityIndicator, StatusBar, Alert, View, Text, AsyncStorage } from 'react-native';
//import Plainlogin from './src/user/Plainlogin.js';
import Mapscreen from './src/map/Mapscreen.js';
import Listscreen from './src/listing/Listscreen.js';
import FBRegister from './src/user/FBRegister.js';
import MyAccountForm from './src/user/MyAccountForm.js';
import Plainregister from './src/user/Plainregister.js';
import MyPortfolio from './src/portfolio/MyPortfolio.js';
import ShowFullPortfolio from './src/portfolio/ShowFullPortfolio.js';
import MyMessages from './src/messages/GetMessage.js';
import CameraScreen from './src/user/CameraScreen.js';
import PhoneVerificationAndroid from './src/user/PhoneVerificationAndroid.js';
import CameraPortfolioScreen from './src/portfolio/CameraPortfolioScreen.js';
import SendMessage from './src/messages/SendMessage.js';
import I18n from 'ex-react-native-i18n';
import { StackActions, createAppContainer, DrawerActions, createStackNavigator, createDrawerNavigator, createSwitchNavigator, DrawerItems } from 'react-navigation'; // Version can be specified in package.json
import { Ionicons } from '@expo/vector-icons';
import LoginForm from './src/user/LoginForm.js';
import { Container, Content, Header, Body, Icon } from 'native-base';
//import FBLoginForm from './src/user/FBLoginForm.js';
import './src/Translations.js';
import * as Expo from 'expo';  // <--- include this line

import NavigationService from './NavigationService';

export default class App extends React.Component {

  constructor(props, context) {
    super(props, context);
  }
  state = {
    logged: false,
    loading: true,
    emailuri: '',
  };

  componentWillMount() {
    I18n.initAsync();
  }
  async componentDidMount() {
    ////Alert.alert("deneme");
    AsyncStorage.getItem('@massage:oturum')
      .then((oturum) => {
        if (oturum == 'basarili') {
          this.setState({
            logged: true,
            loading: false,
          });
        } else {
          this.setState({
            logged: false,
            loading: false,
          });
        }
      });

    AsyncStorage.getItem('@massage:email')
      .then((email) => {
        this.setState({
          emailuri: 'https://www.masseusenearme.com/resimler/kullaniciresmi/' + email + '.jpeg',
          logged: 'loggedIn',
        });
        //////console.log(email)
      });
    //const eposta = await AsyncStorage.getItem('@massage:email');
  }


  //----------
  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
          <Text>{I18n.t('i18n_session_starting')}</Text>
          <StatusBar barStyle="default" />
        </View>
      );
    }
    return <AppContainer
      loggedIn={{ loggedIn: this.state.logged }}
      screenProps={{ emailUri: this.state.emailuri }}
      ref={navigatorRef => {
        NavigationService.setTopLevelNavigator(navigatorRef);
      }}
    />;
  }
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  drawerHeader: {
    height: 200,
    backgroundColor: 'orange'
  },
  drawerImage: {
    height: 150,
    width: 150,
    borderRadius: 75
  }

})

//---------------------------------------------------------------------------------------------
const DrawerMenuTherapist = createDrawerNavigator({

  portfolio: {
    screen: MyPortfolio,
    navigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: 'green' },
      headerMode: 'auto',
      gesturesEnabled: false,
      drawerLabel: I18n.t('i18n_newmassage'),
      drawerIcon: ({ tintColor }) => (
        <Image
          style={{ width: 30, height: 30 }}
          source={require('./assets/new-massage.png')}
        />
      ),
      headerTintColor: '#abc',
      headerTitleStyle: {
        fontWeight: 'bold',
      },

    })
  },
  myaccount: {
    screen: MyAccountForm,
    navigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: 'green' },
      gesturesEnabled: false,
      drawerLabel: I18n.t('i18n_myaccount'),
      drawerIcon: ({ tintColor }) => (
        <Image
          style={{ width: 30, height: 30 }}
          source={require('./assets/home.png')}
        />
      ),
      headerTintColor: '#abc',
      headerTitleStyle: {
        fontWeight: 'bold',
      },

    })
  },
  messages: {
    screen: MyMessages,
    navigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: 'green' },
      gesturesEnabled: false,
      drawerLabel: I18n.t('i18n_messages'),
      drawerIcon: ({ tintColor }) => (
        <Image
          style={{ width: 30, height: 30 }}
          source={require('./assets/box-add.png')}
        />
      ),
      headerTintColor: '#abc',
      headerTitleStyle: {
        fontWeight: 'bold',
      },

    })
  },
  listscreen: {
    screen: Listscreen,
    navigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: 'green' },
      gesturesEnabled: false,
      drawerLabel: I18n.t('i18n_massage_on_the_lists'),
      drawerIcon: ({ tintColor }) => (
        <Image
          style={{ width: 30, height: 30 }}
          source={require('./assets/massage-on-the-maps.png')}
        />
      ),
      headerTintColor: '#abc',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    })
  },
  mapscreen: {
    screen: Mapscreen,
    navigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: 'green' },
      gesturesEnabled: false,
      drawerLabel: I18n.t('i18n_massage_on_the_maps'),
      drawerIcon: ({ tintColor }) => (
        <Image
          style={{ width: 30, height: 30 }}
          source={require('./assets/massage-on-the-maps.png')}
        />
      ),
      headerTintColor: '#abc',
      headerTitleStyle: {
        fontWeight: 'bold',
      },

    })
  },
}, {
    initialRouteName: 'listscreen',
    contentComponent: (props) => (

      <Container>
        <Header style={styles.drawerHeader}>
          <Body>
            <Image
              source={{ uri: props.screenProps.emailUri }}
              style={{
                borderWidth: 1,
                borderColor: 'orange',
                alignItems: 'center',
                justifyContent: 'center',
                width: 200,
                height: 200,
                backgroundColor: 'orange',
                borderRadius: 100,
              }}
            />
          </Body>
        </Header>
        <Content>
          <DrawerItems {...props} />
        </Content>
      </Container>
    ),
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    headerMode: 'none',
  });

DrawerMenuTherapist.navigationOptions = ({ navigation }) => {
  const { routes, index } = navigation.state;
  const navigationOptions = {};

  navigationOptions.headerLeft = <Icon name="menu" size={55} onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} />

  switch (routes[index].routeName) {
    case 'portfolio': navigationOptions.title = I18n.t('i18n_newmassage');
      break;
    case 'myaccount': navigationOptions.title = I18n.t('i18n_myaccount');
      break;
    case 'messages': navigationOptions.title = I18n.t('i18n_messages');
      break;
    case 'mapscreen': navigationOptions.title = I18n.t('i18n_massage_on_the_maps');
      break;
    case 'mapscreen': navigationOptions.title = I18n.t('i18n_massage_on_the_lists');
      break;
  }
  navigationOptions.headerTintColor = '#abc';
  navigationOptions.headerStyle = {
    backgroundColor: '#e6b'
  };
  navigationOptions.headerTitleStyle = {
    fontWeight: 'bold',
  };
  return navigationOptions;
}
//--------------------------------------------------------------
const DrawerMenuPatient = createDrawerNavigator({

  portfolio: {
    screen: MyPortfolio,
    navigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: 'green' },
      headerMode: 'auto',
      gesturesEnabled: false,
      drawerIcon: ({ tintColor }) => (
        <Image
          style={{ width: 30, height: 30 }}
          source={require('./assets/new-massage.png')}
        />
      ),
      headerTintColor: '#abc',
      headerTitleStyle: {
        fontWeight: 'bold',
      },

    })
  },
  myaccount: {
    screen: MyAccountForm,
    navigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: 'green' },
      gesturesEnabled: false,
      drawerLabel: I18n.t('i18n_myaccount'),
      drawerIcon: ({ tintColor }) => (
        <Image
          style={{ width: 30, height: 30 }}
          source={require('./assets/home.png')}
        />
      ),
      headerTintColor: '#abc',
      headerTitleStyle: {
        fontWeight: 'bold',
      },

    })
  },
  messages: {
    screen: MyMessages,
    navigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: 'green' },
      gesturesEnabled: false,
      drawerLabel: I18n.t('i18n_messages'),
      drawerIcon: ({ tintColor }) => (
        <Image
          style={{ width: 30, height: 30 }}
          source={require('./assets/box-add.png')}
        />
      ),
      headerTintColor: '#abc',
      headerTitleStyle: {
        fontWeight: 'bold',
      },

    })
  },
  listscreen: {
    screen: Listscreen,
    navigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: 'green' },
      gesturesEnabled: false,
      drawerLabel: I18n.t('i18n_massage_on_the_lists'),
      drawerIcon: ({ tintColor }) => (
        <Image
          style={{ width: 30, height: 30 }}
          source={require('./assets/massage-on-the-maps.png')}
        />
      ),
      headerTintColor: '#abc',
      headerTitleStyle: {
        fontWeight: 'bold',
      },

    })
  },
  mapscreen: {
    screen: Mapscreen,
    navigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: 'green' },
      gesturesEnabled: false,
      drawerLabel: I18n.t('i18n_massage_on_the_maps'),
      drawerIcon: ({ tintColor }) => (
        <Image
          style={{ width: 30, height: 30 }}
          source={require('./assets/massage-on-the-maps.png')}
        />
      ),
      headerTintColor: '#abc',
      headerTitleStyle: {
        fontWeight: 'bold',
      },

    })
  },
}, {
    initialRouteName: 'listscreen',
    contentComponent: (props) => (

      <Container>
        <Header style={styles.drawerHeader}>
          <Body>
            <Image
              source={{ uri: props.screenProps.emailUri }}
              style={{
                borderWidth: 1,
                borderColor: 'orange',
                alignItems: 'center',
                justifyContent: 'center',
                width: 200,
                height: 200,
                backgroundColor: 'orange',
                borderRadius: 100,
              }}
            />
          </Body>
        </Header>
        <Content>
          <DrawerItems {...props} />
        </Content>
      </Container>
    ),
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    headerMode: 'none',
  });

DrawerMenuPatient.navigationOptions = ({ navigation }) => {
  const { routes, index } = navigation.state;
  const navigationOptions = {};

  navigationOptions.headerLeft = <Icon name="menu" size={55} onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} />

  switch (routes[index].routeName) {
    case 'myaccount': navigationOptions.title = I18n.t('i18n_myaccount');
      break;
    case 'messages': navigationOptions.title = I18n.t('i18n_messages');
      break;
    case 'mapscreen': navigationOptions.title = I18n.t('i18n_massage_on_the_maps');
      break;
    case 'listscreen': navigationOptions.title = I18n.t('i18n_massage_on_the_lists');
      break;
  }
  navigationOptions.headerTintColor = '#abc';
  navigationOptions.headerStyle = {
    backgroundColor: '#e6b'
  };
  navigationOptions.headerTitleStyle = {
    fontWeight: 'bold',
  };
  return navigationOptions;
}
//--------------------------------------------------------------
  
const DrawerMenuLoggedout = createDrawerNavigator({
  login: {
    screen: LoginForm,
    navigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: 'green' },
      gesturesEnabled: false,
      drawerLabel: I18n.t('i18n_login'),
      drawerIcon: ({ tintColor }) => (
        <Image
          style={{ width: 30, height: 30 }}
          source={require('./assets/enter.png')}
        />
      ),
      headerTintColor: '#abc',
      headerTitleStyle: {
        fontWeight: 'bold',
      },

    })
  },
  register: {
    screen: Plainregister,
    navigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: 'green' },
      gesturesEnabled: false,
      drawerLabel: I18n.t('i18n_register'),
      drawerIcon: ({ tintColor }) => (
        <Image
          style={{ width: 30, height: 30 }}
          source={require('./assets/clipboard.png')}
        />
      ),
      headerTintColor: '#abc',
      headerTitleStyle: {
        fontWeight: 'bold',
      },

    })
  },
  fbregister: {
    screen: FBRegister,
    navigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: 'green' },
      gesturesEnabled: false,
      drawerLabel: I18n.t('i18n_register_fb'),
      drawerIcon: ({ tintColor }) => (
        <Image
          style={{ width: 30, height: 30 }}
          source={require('./assets/clipboard.png')}
        />
      ),
      headerTintColor: '#abc',
      headerTitleStyle: {
        fontWeight: 'bold',
      },

    })
  },
}, {
    initialRouteName: 'register',
    contentComponent: (props) => (

      <Container>
        <Header style={styles.drawerHeader}>
          <Body>
            <Image
              source={{ uri: props.screenProps.emailUri }}
              style={{
                borderWidth: 1,
                borderColor: 'orange',
                alignItems: 'center',
                justifyContent: 'center',
                width: 200,
                height: 200,
                backgroundColor: 'orange',
                borderRadius: 100,
              }}
            />
          </Body>
        </Header>
        <Content>
          <DrawerItems {...props} />
        </Content>
      </Container>
    ),
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    headerMode: 'screen',
  });
DrawerMenuLoggedout.navigationOptions = ({ navigation }) => {
  const { routes, index } = navigation.state;
  const navigationOptions = {};

  navigationOptions.headerLeft = <Icon name="menu" size={55} onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} />

  switch (routes[index].routeName) {
    case 'mapscreen': navigationOptions.title = I18n.t('i18n_massage_on_the_maps');
      break;
    case 'listscreen': navigationOptions.title = I18n.t('i18n_massage_on_the_lists');
      break;
    case 'login': navigationOptions.title = I18n.t('i18n_login');
      break;
    case 'register': navigationOptions.title = I18n.t('i18n_register');
      break;
  }
  navigationOptions.headerTintColor = '#abc';
  navigationOptions.headerStyle = {
    backgroundColor: '#e6b'
  };
  navigationOptions.headerTitleStyle = {
    fontWeight: 'bold',
  };
  return navigationOptions;
}
//---------------------------------------------------------------
const patientRootStack = createStackNavigator({
  drawermenu: { screen: DrawerMenuPatient },
  sendmessage: {
    screen: SendMessage,
  },
  photograph: {
    screen: CameraScreen,
  },
  photoportfolio: {
    screen: CameraPortfolioScreen,
  },
})
//---------------------------------------------------------------

const therapistRootStack = createStackNavigator({
  drawermenu: { screen: DrawerMenuTherapist },
  sendmessage: {
    screen: SendMessage,
  },
  photograph: {
    screen: CameraScreen,
  },
  photoportfolio: {
    screen: CameraPortfolioScreen,
  },
  fullportfolio: {
    screen: ShowFullPortfolio,
  },  
  phoneverificationandroid: {
    screen: PhoneVerificationAndroid,
  },

});
//---------------------------------------------------------------
const defaultRootStack = createStackNavigator({
  drawermenu: { screen: DrawerMenuLoggedout },
  sendmessage: {
    screen: SendMessage,
  },
  fullportfolio: {
    screen: ShowFullPortfolio,
  }
})
//--------------------------------------------------------------
class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    this._bootstrapAsync();
  }
  _bootstrapAsync = async () => {
    const oturum = await AsyncStorage.getItem('@massage:oturum');
    const serviceprovider = await AsyncStorage.getItem('@massage:serviceprovider')
    if (oturum == 'basarili') {
      if (serviceprovider == true) {
        this.props.navigation.navigate('App_therapist');
      } else {
        this.props.navigation.navigate('App_patient');
      }
    } else {
      this.props.navigation.navigate('Auth');
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <Text>{I18n.t('i18n_session_credidentials')}</Text>
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
//-----------------------------------------------------------------------------
let switchRootStack = createSwitchNavigator({
  AuthLoading: AuthLoadingScreen,
  App_therapist: therapistRootStack,
  App_patient: patientRootStack,
  Auth: defaultRootStack,
},
  {
    initialRouteName: 'AuthLoading',
  });
const AppContainer = createAppContainer(switchRootStack);
//NavigationService.setTopLevelNavigator(this.therapistRootStack);

//----------------------------------------------------------------
Expo.registerRootComponent(AppContainer);

//---------------------------------------------------------------

//export default App;
