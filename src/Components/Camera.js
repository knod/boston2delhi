import React, { Component } from 'react';
import { Constants, Camera, Permissions } from 'expo';
import { StyleSheet, Text, View, TouchableOpacity, CameraRoll } from 'react-native';

// PRESENTATION
import { FlexButton } from './FlexButton';


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

    record = () => {
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
                <FlexButton onPress={this.stopRecording} extraStyles={styles.stopButton}>
                    {'X'}
                </FlexButton>
            );
        } else {
            return (
                <FlexButton onPress={this.record} extraStyles={styles.stopButton}>
                    {'O'}
                </FlexButton>
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
                style   = {[ styles.camera, {paddingTop: Constants.statusBarHeight} ]}
                type    = {direction}
                zoom    = {zoom}>
                <View style={{
                    justifyContent:     'space-around',
                    flexDirection:      'row',
                    marginLeft:    100,
                    marginRight:   100,
                }}>
                    <FlexButton onPress={this.toggleFacing.bind(this)}>{'FLIP'}</FlexButton>
                </View>
                <View style={styles.bottomRow}>
                    <View style={styles.bottomRowGroup}>
                        <FlexButton onPress={this.zoomIn.bind(this)}>{'+'}</FlexButton>
                        <FlexButton onPress={this.zoomOut.bind(this)}>{'-'}</FlexButton>
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
    recordButton: { backgroundColor: 'darkseagreen', },
    stopButton: { backgroundColor: 'tomato' }
});  // End styles


export {
    JourneyCamera,
};
