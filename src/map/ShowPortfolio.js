import React, { Component } from 'react'
import { Text, Alert, View, StyleSheet, Image } from 'react-native'
import I18n from 'ex-react-native-i18n';
import { Card, CardDikey, CardYatay, Spinner } from '../common';
import StarRating from 'react-native-star-rating';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  tub: {

  },
});
export default class ShowPortfolio extends Component {
  state = {
    email: null,
    sonyildiz: null,
    sonyorum: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      starCount: 3.5
    };
  }
  async componentDidMount() {
    this._mounted = true;
  }
  componentWillUnmount() {
    this._mounted = false
  }
  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }

  getPortfolio() {
    ////Alert.alert(this.props.limit)
    return fetch('https://www.masseusenearme.com/portfolio_get_frontpage.php' + '?email=' + this.props.email, {
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
        if (this._mounted) {
          this.setState({
            sonyildiz: responseJson.yildiz,
            sonyorum: responseJson.yorum,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  render() {
    this.getPortfolio();

    if (this.state.sonyildiz != null && this.state.sonyorum != null) {
      return (
        <Card>
          <CardDikey>
            <StarRating
              disabled={true}
              maxStars={5}
              rating={parseFloat(this.state.sonyildiz)}
              selectedStar={(rating) => this.onStarRatingPress(rating)}
              fullStarColor={'pink'}
            />
          </CardDikey>
        </Card>
      );
    } else {
      return <Text>No rating found for this therapist</Text>;
    }
  }
}
