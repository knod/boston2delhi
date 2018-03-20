import React, { Component } from 'react';
import { Constants, Camera, FileSystem, Permissions } from 'expo';
import { StyleSheet, Text, View, TouchableOpacity, Vibration, CameraRoll } from 'react-native';


const CamButton = function ({ onPress, content, extraStyles }) {

    extraStyles = extraStyles || {};

    return (
        <TouchableOpacity
            style   = {[styles.cameraButton, extraStyles ]}
            onPress = { onPress } >

            <Text style={styles.buttonText}> { content } </Text>

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
        notGranted: [],
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

        var notGranted = [];
        var canImage = await this.getVisualPermissions(),
            canAudio = await this.getAudioPermissions(),
            canSave  = await this.getRollPermissions();

        if ( !canImage ) { notGranted.push( 'video' ) }
        if ( !canAudio ) { notGranted.push( 'sound' ) }
        if ( !canSave ) { notGranted.push( 'video saving' ) }

        this.setState({
            hasPermission: canImage && canAudio && canSave,
            notGranted: notGranted
        });
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
                    this.setState({ vidId: ID, vidURIs: uris, debug: uri });
                });
            });

            this.setState({ recording: true });
        }
    }

    stopRecording = () => {
        // Can't vibrate in here
        if (this.camera) {
            this.camera.stopRecording();
            this.setState({ recording: false });
        }
    }

    renderRecordingButton ( isRecording ) {
        if ( isRecording ) {
            return (
                <CamButton align={'end'} onPress={this.stopRecording} content={'X'}
                    extraStyles={styles.stopButton} />
            );
        } else {
            return (
                <CamButton align={'end'} onPress={this.record.bind(this)} content={'O'}
                    extraStyles={styles.recordButton} />
            );
        }
    } 

    renderNoPermissions () {
        var notGranted  = this.state.notGranted,
            length      = notGranted.length,
            kinds       = '';
        if ( length > 1 ) {
            notGranted[ length - 1 ] = 'and ' + notGranted[ length - 1 ];
        }
        if ( length > 2 ) { kinds = notGranted.join(', '); }
        else { kinds = notGranted.join(' '); }

        var message = 'Permissions for ' + kinds + ' have not been granted - cannot open camera preview.';

        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                <Text style={{ color: 'white' }}>{ message }</Text>
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

        // Add this when some debugging is needed
        // <Text style={{backgroundColor: 'white'}}>{debug}</Text>

        return (
            <Camera
                ref     = {ref => { this.camera = ref; }}
                style   = {[ styles.camera, {paddingTop: Constants.statusBarHeight + 5} ]}
                type    = {direction}
                zoom    = {zoom}>
                <View style={{
                    justifyContent:     'space-around',
                    flexDirection:      'row',
                    marginLeft:    100,
                    marginRight:   100,
                }}>
                    <CamButton onPress={this.toggleFacing.bind(this)} content={' FLIP '} />
                </View>
                <View style={styles.bottomRow}>
                    <View style={styles.bottomRowGroup}>
                        <CamButton align={'end'} onPress={this.zoomIn.bind(this)} content={' + '} />
                        <CamButton align={'end'} onPress={this.zoomOut.bind(this)} content={' - '} />
                    </View>
                    <View style={styles.bottomRowGroup}>{ recordingContent }</View>
                    <View style={styles.bottomRowGroup}></View>
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
        alignContent: 'space-between',
        backgroundColor:    'transparent',
    },
    camera: {
        flex: 1,
        justifyContent: 'space-between',
    },
    bottomRow: {
        margin:  20,
        flexDirection:  'row',
        justifyContent: 'space-between'
    },
    bottomRowGroup: {
        flex:           0.3,
        flexDirection:  'row',
        alignItems:     'center',
        justifyContent: 'center',
    },
    cameraButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        borderRadius: 8,
        borderColor: 'white',
        borderWidth: 1,
    },
    buttonText: {
        color: 'white',
        fontSize: 15,
    },
    recordButton: { backgroundColor: 'darkseagreen', },
    stopButton: { backgroundColor: 'tomato' }
});  // End styles


export {
    JourneyCamera,
    CamButton,
};
