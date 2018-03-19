import React, { Component } from 'react';
import { Constants, Camera, FileSystem, Permissions } from 'expo';
import { StyleSheet, Text, View, TouchableOpacity, Vibration, CameraRoll } from 'react-native';
// import isIPhoneX from 'react-native-is-iphonex';
const isIPhoneX = true;


const CamButton = function ({ onPress, content, flex, align, extraStyles }) {

    extraStyles = extraStyles || {};

    var alignSelf   = {},
        defaultFlex = 1;
    if ( align ) { alignSelf = {alignSelf: 'flex-' + align}  }
    if ( flex === undefined ) { flex = defaultFlex }

    return (
        <TouchableOpacity
            style   = {[styles.flipButton, extraStyles, alignSelf, {flex: flex} ]}
            onPress = { onPress } >

            <Text style={styles.flipText}> { content } </Text>

        </TouchableOpacity>
    );
};  // End <CamButton>


export default class JourneyCamera extends Component {
    state = {
        recording:  false,
        zoom:       0,
        direction:  'back',
        vidId:      1,
        vidURIs:    {},
        hasPermission: false,
    };

    async getVisualPermissions () {
        var { status } = await Permissions.askAsync( Permissions.CAMERA );
        return status === 'granted';
    }

    async getAudioPermissions () {
        var { status } = await Permissions.askAsync( Permissions.AUDIO_RECORDING );
        return status === 'granted';
    }

    async getRollPermissions () {
        var { status } = await Permissions.askAsync( Permissions.CAMERA_ROLL );
        return status === 'granted';
    }

    async componentWillMount () {
        var canImage = await this.getVisualPermissions(),
            canAudio = await this.getAudioPermissions(),
            canSave  = await this.getRollPermissions();
        this.setState({ hasPermission: canImage && canAudio && canSave });
    }

    componentDidMount () {
        // Make sure we can save files? Not sure how to access them on iOS.
        // FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'Journeys').catch(e => {
        //     console.log(e, 'Directory exists');
        // });
    }

    componentWillUnmount () {
        // Stop the recording camera if the app is being exited unexpectedly
        if (this.camera && this.state.recording) {
            this.camera.stopRecording();
            this.setState({ recording: false });
        }
    }

    toggleFacing () {
        var direction = this.state.direction === 'back' ? 'front' : 'back';
        this.setState({ direction: direction });
    }

    zoomOut () {
        var zoom = this.state.zoom - 0.1 < 0 ? 0 : this.state.zoom - 0.1;
        this.setState({ zoom: zoom });
    }

    zoomIn () {
        var zoom = this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1;
        this.setState({ zoom: zoom });
    }

    record = async () => {
        /** @todo Do we want to set a maxFileSize? */
        if (this.camera) {

            this.camera.recordAsync().then(( data ) => {

                // Can't vibrate as soon as we get in here

                CameraRoll.saveToCameraRoll( data.uri ).then(( uri ) => {

                    /** @todo Save vid IDs and vid ID to permanent storage so we can fetch them in the future */
                    var ID      = this.state.vidId + 1,
                        uris    = {...this.state.vidURIs}
                    uris[ ID ]  = uri;

                    Vibration.vibrate();
                    this.setState({ vidId: ID, vidURIs: uris, debug: uri });

                });

            });

            this.setState({ recording: true });
        }
    }

    stopRecording = () => {
        // Can't vibrate in here
        Vibration.vibrate()
        if (this.camera) {
            this.camera.stopRecording();
            this.setState({ recording: false });
        }
    }

    renderRecordingButton ( isRecording ) {
        if ( isRecording ) {
            return (
                <CamButton align={'end'} flex={1} onPress={this.stopRecording} content={'X'}
                    extraStyles={styles.stopButton} />
            );
        } else {
            return (
                <CamButton align={'end'} flex={1} onPress={this.record.bind(this)} content={'O'}
                    extraStyles={styles.recordButton} />
            );
        }
    } 

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
            debug,
            recording,
            zoom,
            direction,
            vidId,
            hasPermission,
        } = this.state;

        var recordingContent = this.renderRecordingButton( recording );

        return (
            <Camera
                ref     = {ref => { this.camera = ref; }}
                style   = {{ flex: 1, }}
                type    = {direction}
                zoom    = {zoom}>
                <View style={{
                    flex:               1,
                    width:              300,
                    justifyContent:     'space-around',
                    paddingTop:         Constants.statusBarHeight / 2,
                    backgroundColor:    'transparent',
                    flexDirection:      'row',
                }}>
                    <CamButton onPress={this.toggleFacing.bind(this)} content={' FLIP '} />
                </View>
                <Text style={{backgroundColor: 'white'}}>{debug}</Text>
                <View style={{
                    flex:               0.1,
                    alignSelf:          'flex-end',
                    paddingBottom:      isIPhoneX ? 20 : 0,
                    backgroundColor:    'transparent',
                    flexDirection:      'row',
                }}>
                    <CamButton align={'end'} flex={0.1} onPress={this.zoomIn.bind(this)} content={' + '} />
                    <CamButton align={'end'} flex={0.1} onPress={this.zoomOut.bind(this)} content={' - '} />
                    <View style={{ flex: 0.3, flexDirection: 'row', }}>{ recordingContent }</View>
                </View>
            </Camera>
        );
    }


    render () {
        const cameraScreenContent = this.state.hasPermission
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
    navigation: { flex: 1, },
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
    recordButton: { backgroundColor: 'darkseagreen', },
    stopButton: { backgroundColor: 'red' }
});


export {
    JourneyCamera,
    CamButton,
};
