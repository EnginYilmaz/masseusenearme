import React, { Component } from 'react';
import { View } from 'react-native';
import { Header, Button, Spinner } from '../common';
import LoginForm from './FBLoginForm.js';
import I18n from 'ex-react-native-i18n';

class Plainlogin extends Component {
  state = { loggedIn: false };

  renderContent() {
    switch (this.state.loggedIn) {
      case true:
        return (
          <Button>
            {I18n.t('i18n_logout')}
          </Button>
        );
      case false:
        return <LoginForm />;
      default:
        return <Spinner size="large" />;
    }
  }
  render() {
    return (
      <View>
        <Header headerText={I18n.t('i18n_user_login_information')} />
        {this.renderContent()}
      </View>
    );
  }
}

export default Plainlogin;
