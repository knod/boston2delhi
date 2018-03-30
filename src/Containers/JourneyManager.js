import React, { Component } from 'react';
import { View, Text, StyleSheet, } from 'react-native';

// FUNCTIONAL
import { JourneyCamera } from '../Components/Camera';
import { CameraOverlay } from '../Components/CameraOverlay';

// PRESENTATION
import { FlexButton } from '../Components/FlexButton';


class AfterVideoOver extends Component {
    state = { next: null }

    onCamera = ( evnt ) => { this.props.onChoose( 'camera' ) }

    onOther = ( evnt ) => { this.props.onChoose( 'objects' ) }

    render () {
        return (
            <View style={styles.choices}>
                <FlexButton onPress={this.onCamera} extraStyles={styles.button}>
                    Button for camera (placeholder)
                </FlexButton>
                <FlexButton onPress={this.onOther} extraStyles={styles.button}>
                    Button for objects (placeholder)
                </FlexButton>
            </View>
        );
    }  // End render()
};  // End <AfterVideoOver>


class JourneyManager extends Component {

    state = { stage: 'vidOver' }

    onCancelCamera = () => { this.props.onBack(); }

    onChoose = ( choice ) => {
        if ( choice === 'objects' ) {
            this.props.onBack();
        } else {
            this.setState({ stage: choice });
        }
    }

    render () {
        var stage = this.state.stage;

        if ( stage === 'vidOver' ) {
            return (
                <View style={styles.manager}>
                    <AfterVideoOver onChoose={this.onChoose} />
                </View>
            );
        } else if ( stage === 'camera' ) {
            return (
                <JourneyCamera
                    onCancel    = { this.onCancelCamera }
                    onStop      = { this.onCancel }
                    Overlay     = { CameraOverlay } />
            );
        } else {
            // This shouldn't happen
            return null;
        }
    }
};  // End <JourneyManager>


var styles = StyleSheet.create({
    manager: {
        flex:           1,
        alignContent:   'center',
        justifyContent: 'center',
    },
    choices: {
        flex: 1,
        alignContent:   'center',
        justifyContent: 'center',
        // Margin around outer edges
        padding:        20,
    },
    // Make the buttons not take up the whole screen
    // Big enough for landscape, not too big for portrait
    button: { margin: 5, flex: 0.2 }
});  // end styles


export {
    JourneyManager,
    AfterVideoOver,
}
