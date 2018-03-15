import { Constants, Camera, FileSystem, Permissions } from 'expo';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Slider, Vibration } from 'react-native';
// import GalleryScreen from './GalleryScreen';
// import isIPhoneX from 'react-native-is-iphonex';
const isIPhoneX = true;


const CamButton = function ({ onPress, text, flex, align, extraStyles }) {

    extraStyles = extraStyles || {};

    var alignSelf   = {},
        defaultFlex = 1;
    if ( align ) { alignSelf = {alignSelf: 'flex-' + align}  }
    if ( flex === undefined ) { flex = defaultFlex }

    return (
        <TouchableOpacity
            style   = {[styles.flipButton, extraStyles, alignSelf, {flex: flex} ]}
            onPress = { onPress } >

            <Text style={styles.flipText}> { text } </Text>

        </TouchableOpacity>
    );
};  // End <CamButton>


export default class JourneyCamera extends React.Component {
    state = {
        zoom:       0,
        direction:  'back',
        photoId:    1,
        permissionsGranted: false,
    };

    async componentWillMount () {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ permissionsGranted: status === 'granted' });
    }

    componentDidMount () {
        FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'Journeys').catch(e => {
            console.log(e, 'Directory exists');
        });
    }

    toggleFacing () {
        var direction = this.state.direction === 'back' ? 'front' : 'back';
        this.setState({ direction: direction });
    }

    toggleFocus () {
        var autoFocus = this.state.autoFocus === 'on' ? 'off' : 'on';
        this.setState({ autoFocus: autoFocus });
    }

    zoomOut () {
        var zoom = this.state.zoom - 0.1 < 0 ? 0 : this.state.zoom - 0.1;
        this.setState({ zoom: zoom });
    }

    zoomIn () {
        var zoom = this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1;
        this.setState({ zoom: zoom });
    }

    takePicture = async function() {
        if (this.camera) {
            this.camera.takePictureAsync().then(data => {
                FileSystem.moveAsync({
                    from: data.uri,
                    to: `${FileSystem.documentDirectory}Journeys/Photo_${this.state.photoId}.jpg`,
                }).then(() => {
                    var ID = this.state.photoId + 1
                    this.setState({ photoId: ID });
                    Vibration.vibrate();
                });
            });
        }
    };

    renderNoPermissions () {
        return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
            <Text style={{ color: 'white' }}>
                Camera permissions not granted - cannot open camera preview.
            </Text>
        </View>
        );
    }

    renderCamera () {
        var {
            zoom,
            direction,
            photoId,
            permissionsGranted,
        } = this.state;

        return (
            <Camera
                ref     = {ref => { this.camera = ref; }}
                style   = {{ flex: 1, }}
                type    = {direction}
                zoom    = {zoom}>
                <View style={{
                    flex:               0.5,
                    justifyContent:     'space-around',
                    paddingTop:         Constants.statusBarHeight / 2,
                    backgroundColor:    'transparent',
                    flexDirection:      'row',
                }}>
                    <CamButton onPress={this.toggleFacing.bind(this)} text={' FLIP '} />
                </View>
                <View style={{
                    flex: 0.1,
                    alignSelf:          'flex-end',
                    paddingBottom:      isIPhoneX ? 20 : 0,
                    backgroundColor:    'transparent',
                    flexDirection:      'row',
                }}>
                    <CamButton align={'end'} flex={0.1} onPress={this.zoomIn.bind(this)} text={' + '} />
                    <CamButton align={'end'} flex={0.1} onPress={this.zoomOut.bind(this)} text={' - '} />
                    <CamButton align={'end'} flex={0.3} onPress={this.takePicture.bind(this)} text={' SNAP '}
                        extraStyles={styles.picButton} />
                </View>
            </Camera>
        );
    }


    render () {
        const cameraScreenContent = this.state.permissionsGranted
            ? this.renderCamera()
            : this.renderNoPermissions();
        const content = cameraScreenContent;
        return <View style={styles.container}>{content}</View>;
    }
}  // End <JourneyCamera>


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    navigation: {
        flex: 1,
    },
    flipButton: {
        flex: 0.3,
        height: 40,
        marginHorizontal: 2,
        marginBottom: 10,
        marginTop: 20,
        borderRadius: 8,
        borderColor: 'white',
        borderWidth: 1,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flipText: {
        color: 'white',
        fontSize: 15,
    },
    picButton: {
        backgroundColor: 'darkseagreen',
    },
});


export {
    JourneyCamera,
    CamButton,
};
