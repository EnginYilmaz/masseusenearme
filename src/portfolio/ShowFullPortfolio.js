import React, { Component } from 'react';
import { TouchableOpacity, ScrollView, TouchableHighlight, Modal, Alert, Platform, Text, TextInput, AsyncStorage, View, StyleSheet } from 'react-native';
import ShowProfile from '../map/ShowProfile.js';
import ShowPortfolio from './ShowPortfolio.js';
import { Constants, Location, Permissions } from 'expo';
import I18n from 'ex-react-native-i18n';
import { Button, Card, CardDikey, Spinner } from '../common';
import StarRating from 'react-native-star-rating';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  map: {
    height: '30%',
    width: '95%',
    flex: 1,
  },
  profile: {
    height: '20%',
    width: '100%',
    flex: 1,
    flexDirection: 'column'
  },
  tub: {
    height: 300,
    width: 400,
    flex: 1,
  },
});

export default class ShowFullPortfolio extends Component {
  state = {
    adsoyad: null,
    email: null,
    patientEmail: null,
    sonuctekst: null,
    comment: null,
    starCount: null,
    errorMessage: null,
    yorumlar:
      [{
        "yorum": "No, comment made yet",
      }],
  }
  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }

  async componentDidMount() {
    this._mounted = true;
  }

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    }

    ////Alert.alert(this.props.navigation.getParam('patient_email'));

    fetch('https://www.masseusenearme.com/query_user.php' + '?email=' + this.props.navigation.getParam('therapist_email'), {
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
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson) {
          if (this._mounted) {
            this.setState({
              adsoyad: responseJson.adsoyad,
              email: this.props.navigation.getParam('therapist_email'),
              uid: responseJson.uid,
              ozgecmis: responseJson.ozgecmis,
              gender: responseJson.gender,
            });
          }
        }
      })
    this.getLastComments();
    this.getStars();
  }
  componentWillUnmount() {
    this._mounted = false
  }
  renderCommentButton() {
    if (this._mounted) {
      if (this.state.loading) {
        return <Spinner size="small" />;
      } else {
        return (
          <Button onPress={this.onCommentPress.bind(this)} style={{ width: 100 }}>
            {I18n.t('i18n_send_comment')}
          </Button>
        );
      }
    }
  }
  onCommentPress() {
    this.setState({ error: '', loading: true });
    //this.props.propsnav.navigate('sendmessage', { email: this.props.email })
    ////Alert.alert(this.state.starCount+' ');
    ////////console.log('https://www.masseusenearme.com/comment_update_put.php' + '?MassagerEmail=' + this.props.navigation.getParam('therapist_email') + '&PatientEmail=' + this.state.PatientEmail + '&Comment=' + this.state.comment + '&Yildiz=' + this.state.starCount)
    myURL = 'https://www.masseusenearme.com/comment_update_put.php' + '?MassagerEmail=' + this.props.navigation.getParam('therapist_email') + '&PatientEmail=' + this.props.navigation.getParam('patient_email') + '&Comment=' + this.state.comment + '&Yildiz=' + this.state.starCount;
    ////console.log(myURL);
    fetch(myURL, {
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
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson) {
          if (this._mounted) {
            this.setState({
              sonuctekst: responseJson.basari,
              loading: false,
            });
          }
        }
      })
    this.getStars();
    this.getLastComments();
  }

  getLastComments() {
    this.setState({ error: '', loadingCommentsHistory: true });
    //this.props.propsnav.navigate('sendmessage', { email: this.props.email })
    ////Alert.alert(this.state.starCount+' ');
    ////////console.log('https://www.masseusenearme.com/comment_history_get.php' + '?MassagerEmail=' + this.props.navigation.getParam('therapist_email') + '&PatientEmail=' + this.state.PatientEmail);
    myURL = 'https://www.masseusenearme.com/comment_history_get.php' + '?MassagerEmail=' + this.props.navigation.getParam('therapist_email') + '&PatientEmail=' + this.props.navigation.getParam('patient_email');
    //console.log(myURL);
    return fetch(myURL, {
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

    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson) {
          this.setState({
            yorumlar: responseJson,
          });
        }
      })
  }

  getStars() {
    this.setState({ error: '', loadingCommentsHistory: true });
    //this.props.propsnav.navigate('sendmessage', { email: this.props.email })
    ////Alert.alert(this.state.starCount+' ');
    ////////console.log('https://www.masseusenearme.com/comment_star_get.php' + '?MassagerEmail=' + this.props.navigation.getParam('therapist_email') + '&PatientEmail=' + this.state.PatientEmail);
    return fetch('https://www.masseusenearme.com/comment_star_get.php' + '?MassagerEmail=' + this.props.navigation.getParam('therapist_email'), {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
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
        if (responseJson) {
          this.setState({
            starCount: Number(responseJson.ortalama),
          });
        }
      })
  }

  render() {
    if (this.state.email) {
      const yok = '<CardDikey><Text>No comment found</Text></CardDikey>';
      return (
        <View style={{ width: '100%', height: '100%' }}>
          <Card>
            <CardDikey>
              <ShowProfile
                key={this.state.uid}
                propsnav={this.props.navigation}
                style={styles.profile}
                adsoyad={this.state.adsoyad}
                email={this.state.email}
                ozgecmis={this.state.ozgecmis}
                gender= {this.state.gender}
              />
            </CardDikey>
            <CardDikey>
              <ScrollView horizontal={true}>
                <ShowPortfolio key={this.state.uid + Math.floor(Math.random() * 10000000)} style={styles.tub} email={this.state.email} limit='11' />
              </ScrollView>
            </CardDikey>
            <CardDikey>
              <TextInput
                style={{ height: 60, width: '90%', borderColor: 'black', borderWidth: 4, borderRadius: 15, margin: 10, padding: 10, backgroundColor: '#ffee8f' }}
                onChangeText={(comment) => this.setState({ comment })}
                value={this.state.comment}
              />
            </CardDikey>
            <CardDikey>
              <StarRating
                disabled={false}
                maxStars={5}
                rating={this.state.starCount}
                selectedStar={(rating) => this.onStarRatingPress(rating)}
                fullStarColor={'pink'}
              />
              {this.renderCommentButton()}
            </CardDikey>
            <CardDikey>
              <Text style={styles.errorTextStyle}>
                {this.state.error}
              </Text>
            </CardDikey>
            <Card>
              <ScrollView style={{ height: 100 }}>
                {
                  Array.isArray(this.state.yorumlar) ?
                    this.state.yorumlar.map((yorumvar, index) => (
                      <CardDikey><Text key={yorumvar.sayac + Math.floor(Math.random() * 10000000)}>{yorumvar.yorum}</Text></CardDikey>
                    ))
                    : <Spinner size="small"/>
                }
              </ScrollView>
            </Card>
          </Card>
        </View>
      );
    } else {
      return (
        <Text>
          No, portfolio found for this therapist.
        </Text>
      );
    }
  }
}