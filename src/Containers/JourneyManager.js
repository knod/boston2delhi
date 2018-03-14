import React, { Component } from 'react';
import { WebView, Button, Dimensions, View } from 'react-native';

var dims = new Dimensions()

const Choices = function () {

    const onPress = function () {};

    var {height, width} = Dimensions.get('window'),
        halfHeight      = height/2,
        halfWidth       = width/2,
        style           = {
            height: height,
            width: width,
            position: 'absolute',
            top: 0,
            left: -1 * halfHeight,
            display: 'flex',
            backgroundColor: 'teal'
        }

    return (
        <View style={style}>
            <Button title={'Button for camera (placeholder)'} onPress={onPress} />
            <Button title={'Button for objects (placeholder)'} onPress={onPress} />
        </View>
    );
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
    return (
        <View>
            <WebView
                ref={'webview'}
                source={{ uri: 'https://www.youtube.com/watch?v=sd1KFa0pPvM' }}
                javaScriptEnabled={true}
                decelerationRate="normal"
                style={{ width: 200, height: 20 }}  />
            <Choices/>
        </View>
    );
  }
}

export {
    JourneyManager
}
