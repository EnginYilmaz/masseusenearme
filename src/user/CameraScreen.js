import React from 'react';
import { Camera, Permissions } from 'expo';
import { Text, View, TouchableOpacity } from 'react-native';
import I18n from 'ex-react-native-i18n';

export default class App extends React.Component {
    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
    };
    async componentWillMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    async press() {
        //////console.log('Button Pressed');
        if (this.camera) {
            //////console.log('Taking photo');
            let photo = await this.camera.takePictureAsync();
            //////console.log(photo);
            this.props.navigation.navigate('myaccount', { photouri: photo.uri });
        }

    }

    render() {
        return (
            <Camera
                style={{ flex: 1 }}
                ref={(ref) => { this.camera = ref }}
                type={Camera.Constants.Type.front}
            >
                <View style={{ flex: 1 }}></View>
                <TouchableOpacity
                    style={{ flex: 0, backgroundColor: 'orange', height: 75 }}
                    onPress={this.press.bind(this)} >
                    <Text>{I18n.t('i18n_click_to_shot_photo')}</Text>
                </TouchableOpacity>
            </Camera>
        );
    }
}

/*
import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera, Permissions } from 'expo';
import I18n from 'ex-react-native-i18n';

export default class App extends React.Component {
    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
    };

    async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }
    async press() {
        if (this.state.hasCameraPermission== 'granted') {
            //////console.log('Button Pressed');
            if (this.camera) {
                //////console.log('Taking photo');
                let photo = await this.camera.takePictureAsync();
                //////console.log(photo);
                this.props.navigation.navigate('myaccount', {photouri: photo.uri} );
            }
        }
    }
    render() {
        const { hasCameraPermission } = this.state;
        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            return (
                <View style={{ flex: 1 }}>
                    <Camera style={{ flex: 1 }} type={this.state.type}>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'transparent',
                                flexDirection: 'row',
                            }}>
                            <View style={{ flex: 1 }}></View>
                            <TouchableOpacity
                                style={{ flex: 0, backgroundColor: 'orange', height: 75 }}
                                onPress={this.press.bind(this)} >
                                <Text>{I18n.t('i18n_click_to_shot_photo')}</Text>
                            </TouchableOpacity>
                        </View>
                    </Camera>
                </View >
            );
        }
    }
}
*/