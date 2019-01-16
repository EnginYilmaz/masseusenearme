import React from 'react';
import { Text } from 'react-native';
import { Button, Card, CardDikey} from '../common';
import { createStackNavigator } from 'react-navigation'; // Version can be specified in package.json


const Mainpage = () => {

    return (
        <Card>
        <CardDikey>
            <Text>Massage finder application</Text>
        </CardDikey>
        <CardDikey>
            <Button onPress={Actions.plainregister({type: 'reset'})}>
                Kayıt ol
            </Button>
        </CardDikey>
        <CardDikey>
         <Button onPress={Actions.plainlogin({type: 'reset'})}>
            Giriş yap
         </Button>
        </CardDikey>
      </Card>
    );
};

export default Mainpage
