import React, { Component, Dimensions } from 'react';
import { WebView } from 'react-native';


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
      <WebView
            ref={'webview'}
            source={{ uri: 'https://www.youtube.com/watch?v=sd1KFa0pPvM' }}
            javaScriptEnabled={true}
            decelerationRate="normal"
            style={{ width: 200, height: 20 }}  />
    );
  }
}

export {
    JourneyManager
}
