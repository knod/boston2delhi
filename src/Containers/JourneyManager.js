import React, { Component } from 'react';
import { Constants } from 'expo';
import { WebView, Dimensions, View, Text, TouchableOpacity } from 'react-native';

// FUNCTIONAL
import { JourneyCamera } from '../Components/Camera';

// PRESENTATION
import { FlexButton } from '../Components/FlexButton';


class AfterViewing extends Component {
    state = { next: null }

    onCamera = ( evnt ) => {
        this.onChoose( 'JourneyCamera' )
    };

    onObjects = ( evnt ) => {
        this.onChoose( 'Objects' )
    }

    onChoose = ( choice ) => {
        this.props.onChoose( choice );
    }

    render () {
    
        // if ( this.state.next === 'camera' ) {
        //     // After video, option to take another video?
        //     return (<JourneyCamera onCancel={this.cancelVideo} />);
        // } else {
        //     // View styling:
        //     // Make the buttons not take up the whole screen
        //     // Big enough for landscape, not too big for portrait
            return (
                <View style={{ flex: 0.4, }}>
                    <FlexButton onPress={this.onCamera} extraStyles={styles.button}>
                        Button for camera (placeholder)
                    </FlexButton>
                    <FlexButton onPress={this.onObjects} extraStyles={styles.button}>
                        Button for objects (placeholder)
                    </FlexButton>
                </View>
            );
        // }
    }  // End render()
};  // End <AfterViewing>


class JourneyManager extends Component {

    state = { stage: 'AfterViewing' }

    onCancelCamera = () => {
        // this.onChoose( 'Objects' );
        this.onChoose( 'AfterViewing' );
    }

    onChoose = ( choice ) => {
        this.setState({ stage: choice });
    }

    render () {
        // if mediaPlaybackRequiresUserAction={true} then it will
        // require a click on a website, but it will also play with
        // sound. Otherwise it doesn't play with sound. On my mac
        // simulator, at least.
        // scalesPageToFit does nothing.
        // initialScale does nothing, but it's for Android.
        // startInLoadingState={false} does nothing.
        // allowsInlineMediaPlayback={true} means it's just a youtube
        // web page and changes it for the future
        // contentInset does not affect full screen
        // <WebView
        //     ref={'webview'}
        //     source={{ uri: 'https://www.duckduckgo.com' }}
        //     javaScriptEnabled={true}
        //     decelerationRate="normal"
        //     style={{ width: 200, height: 20 }}  />

        // In future, put video in here until it ends.

        var stage = this.state.stage;

        if ( stage === 'AfterViewing' ) {
            return (
                <View style={[ styles.manager, { marginTop: Constants.statusBarHeight } ]}>
                    <AfterViewing onChoose={this.onChoose} />
                </View>
            );
        } else if ( stage === 'JourneyCamera' ) {
            return (<JourneyCamera onCancel={this.onCancelCamera} />);
        } else {
            return null;
        }
    }
};  // End <JourneyManager>


var styles = {
    manager: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        // Margin around outer edges
        margin: 20,
    },
    choices: {

    },
    button: { margin: 5, }
};  // end styles


export {
    JourneyManager
}
