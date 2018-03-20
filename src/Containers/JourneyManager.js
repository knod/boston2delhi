import React, { Component } from 'react';
import { Constants } from 'expo';
import { WebView, Dimensions, View, Text, TouchableOpacity } from 'react-native';

// FUNCTIONAL
import { JourneyCamera } from '../Components/Camera';

// PRESENTATION
import { FlexButton } from '../Components/FlexButton';


class EndOfVideo extends Component {
    state = { next: null }

    onCamera = ( evnt ) => {
        this.setState({ next: 'camera' });
    };

    onObjects = ( evnt ) => {}

    render () {
    
        if ( this.state.next === 'camera' ) {
            // After video, option to take another video?
            return (<JourneyCamera/>);
        } else {
            // View styling:
            // Make the buttons not take up the whole screen
            // Big enough for landscape, not too big for portrait
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
        }
    }  // End render()
};  // End <EndOfVideo>


class JourneyManager extends Component {
  render() {
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
    return (
        <View style={[ styles.manager, { marginTop: Constants.statusBarHeight } ]}>
            <EndOfVideo/>
        </View>
    );
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
    button: { margin: 5, }
};  // end styles


export {
    JourneyManager
}
