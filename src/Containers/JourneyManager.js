import React, { Component } from 'react';
import { WebView, Button, Dimensions, View, Text } from 'react-native';

// CUSTOM
import { JourneyCamera } from '../Components/Camera';


class Choices extends Component {
    state = { next: null }

    onCamera = ( evnt ) => {
        this.setState({ next: 'camera' });
    };

    render () {

        var {height, width} = Dimensions.get('window'),
            halfHeight      = height/2,
            halfWidth       = width/2,
            style           = {
                height: height,
                width: width,
                // position: 'absolute',
                // top: -1 * halfHeight,
                // left: -1 * halfWidth,
                // display: 'flex',
                flex: 1,
                backgroundColor: 'lightblue',
            }
    
        if ( this.state.next === 'camera' ) {
            // After video, option to take another video?
            return (<JourneyCamera />);
        } else {
            return (
                <View style={style}>
                    <Button title={'Button for camera (placeholder)'} name='camera' onPress={this.onCamera} />
                    <Button title={'Button for objects (placeholder)'} name='objects' onPress={function(){}}/>
                </View>
            );
        }
    }  // End render()
};  // End <Choices>


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

    return (
        <View style={{flex: 1}}>
            <Choices/>
        </View>
    );
  }
}

export {
    JourneyManager
}
