import React, { Component } from 'react';
import { View, Text, StyleSheet, } from 'react-native';

// PRESENTATION
import { FlexButton } from '../Components/FlexButton';


class CameraOverlay extends Component {

    renderRecordingButton = ( isRecording ) => {

        var {
            stopRecording,
            record,
        } = this.props;

        if ( isRecording ) {
            return (
                <FlexButton onPress={ stopRecording } extraStyles={ styles.stopButton }>
                    { 'X' }
                </FlexButton>
            );
        } else {
            return (
                <FlexButton onPress={ record } extraStyles={ styles.recordButton }>
                    { 'O' }
                </FlexButton>
            );
        }
    } 

    renderCameraUI = () => {

        var {
            recording,
            toggleFacing,
            zoomIn,
            zoomOut,
            onCancel,
            debug,
        } = this.props;

        var recordingContent = this.renderRecordingButton( recording );

        return (
            <View style={ styles.uiContainer }>
                <View style={ styles.topRow }>
                    <FlexButton onPress={ toggleFacing }>{ 'FLIP' }</FlexButton>
                </View>
                <View style={ styles.bottomRow }>
                    <View style={ styles.bottomRowGroup }>
                        <FlexButton onPress={ zoomIn }>{ '+' }</FlexButton>
                        <FlexButton onPress={ zoomOut }>{ '-' }</FlexButton>
                    </View>
                    <View style={ styles.bottomRowGroup }>{ recordingContent }</View>
                    <View style={ styles.bottomRowGroup }>
                        <FlexButton
                            onPress     = { onCancel }
                            extraStyles = { styles.cancelButton }
                            textStyles  = { styles.cancleText }>
                                { 'Cancel' }
                        </FlexButton>
                    </View>
                </View>
            </View>
        );
    };

    renderNoPermissions = ( permissionsNotGranted, onCancel ) => {

        var length  = permissionsNotGranted.length,
            kinds   = '';

        // Add commas and other nice grammar stuff if needed
        if ( length > 1 ) {
            permissionsNotGranted[ length - 1 ] = 'and ' + permissionsNotGranted[ length - 1 ];
        }

        if ( length > 2 ) { kinds = permissionsNotGranted.join(', '); }
        else { kinds = permissionsNotGranted.join(' '); }

        // Build the final message
        var message = 'Permissions for ' + kinds + ' have not been granted - cannot open camera preview.';

        return (
            <View style={styles.permissions}>
                <Text style={ styles.permissionsText }>{ message }</Text>
                <View style={ styles.bottomRow }>
                    <View style={ styles.bottomRowGroup }>
                        <FlexButton
                            onPress     = { onCancel }
                            extraStyles = { styles.cancelButton }
                            textStyles  = { styles.cancleText }>
                                { 'Cancel' }
                        </FlexButton>
                    </View>
                </View>
            </View>
        );
    }


    render () {
        var { hasPermissions, notGranted, onCancel } = this.props,
            overlay = null;

        if ( hasPermissions ) {
            overlay = this.renderCameraUI();
        } else {
            overlay = this.renderNoPermissions( notGranted, onCancel );
        }

        return <View style={ styles.container }>{ overlay }</View>;
    }
}


const styles = StyleSheet.create({
    container: {
        flex:            1,
        backgroundColor: 'red',
        alignContent:    'space-between',
        backgroundColor: 'transparent',
    },
    uiContainer: {
        flex: 1,
    },
    permissions: {
        flex:           1,
        backgroundColor: 'white',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        10,
    },
    permissionsText: {
        color: 'black',
    },
    topRow: {
        flex:           0.05,
        justifyContent: 'space-around',
        flexDirection:  'row',
        marginLeft:     100,
        marginRight:    100,
        marginTop:      20,
    },
    bottomRow: {
        flex:           1,
        margin:         20,
        flexDirection:  'row',
        justifyContent: 'space-between',
        alignItems:     'flex-end',
    },
    bottomRowGroup: {
        flex:           0.3,
        flexDirection:  'row',
        alignItems:     'center',
        justifyContent: 'center',
    },
    recordButton:   { backgroundColor: 'darkseagreen', },
    stopButton:     { backgroundColor: 'tomato' },
    cancelButton:   { borderColor: 'tomato' },
    cancleText:     { color: 'black', },
});  // End styles


export {
    CameraOverlay,
};
