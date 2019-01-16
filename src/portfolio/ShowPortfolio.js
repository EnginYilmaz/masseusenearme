import React, { Component } from 'react'
import { TouchableHighlight, Modal, Text, Alert, View, StyleSheet, Image } from 'react-native'
import I18n from 'ex-react-native-i18n';
import { Card, CardDikey, CardYatay, Spinner } from '../common';

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
    urunler: [],
    modalVisible: false,
    activepicture: null,
    activead: null,
    activeaciklama: null,
  };
  async componentDidMount() {
    this._mounted = true;
  }
  componentWillUnmount() {
    this._mounted = false
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  getPortfolio() {
    ////Alert.alert(this.props.limit)
    return fetch('https://www.masseusenearme.com/portfolio_get_map.php' + '?email=' + this.props.email + '&limit=' + this.props.limit, {
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
            urunler: responseJson
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  render() {
    this.getPortfolio();
    const yok = '<View><Text>No, portfolio found</Text></View>';
    if (this.state.urunler != null) {
      return (
        <View style={{ marginTop: 22 }}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              //Alert.alert('Modal has been closed.');
            }}>
            <View style={{ marginTop: 22 }}>
              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                <Text style={{ fontSize: 40, paddingLeft: 10 }}>X</Text>
              </TouchableHighlight>
              <View>
                <Image style={{ height: '85%', width: '100%', paddingLeft: 100 }} source={{ uri: 'https://www.masseusenearme.com/resimler/portfolio/buyuk-' + this.state.activepicture }} />
                <Text>{this.state.activetarih}</Text>
                <Text>{this.state.activead}</Text>
                <Text>{this.state.activeaciklama}</Text>
              </View>
            </View>
          </Modal>
          <CardDikey>
            {
              Array.isArray(this.state.urunler) ?
                this.state.urunler.map((urun, index) => (
                  <Card>
                    <TouchableHighlight
                      onPress={() => {
                        this.setModalVisible(true);
                        this.setState({
                          activepicture: urun.resimler,
                          activead: urun.urunadi,
                          activeaciklama: urun.urunaciklamasi,
                          activetarih: urun.uretimtarihi,
                        })
                      }}><Image key={urun.upid} style={{ width: 50, height: 50 }} source={{ uri: 'https://www.masseusenearme.com/resimler/portfolio/' + urun.resimler }} />
                    </TouchableHighlight>
                  </Card>
                ))
                : <Spinner size="small" />
            }
          </CardDikey>
        </View>
      );
    } else {
      return (
        <CardDikey>
          <Card>
            <Text>{I18n.t('i18n_no_massage')}</Text>
          </Card>
        </CardDikey>
      );
    }
  }
  f
}