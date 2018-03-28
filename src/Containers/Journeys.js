// Page for users to select journeys

import React, { Component } from 'react';
import { Button, View } from 'react-native';

// OURS
import { JourneyManager } from './JourneyManager';
import { Camera } from '../Components/Camera';


class Journeys extends Component {
    state = {which: 'objects'}

    onTap = ( evnt, action ) => {
        if ( action === 'goToJourney' ) { this.setState({which: 'journey'}); }
        else { this.setState({which: 'objects'}); }
    }

    onBack = (evnt) => {
        this.setState({which: 'objects'});
    }

    render () {

        var onTap = this.onTap;
        if ( this.state.which === 'journey' ) {
            return <JourneyManager path={'something'} onBack={this.onBack}/>
        } else {
            return <Objects onTap={onTap} />
        }

    }
};  // End <Journeys>


const Objects = function ({ onTap }) {

    var myTap = (evnt) => {
        onTap( evnt, 'goToJourney' );
    }

    return (<View className={'opening-choice'} centered size={'mini'}>
        <Button title={'1'} onPress={myTap} />
        <Button title={'2'} onPress={myTap} />
        <Button title={'3'} onPress={myTap} />
        <Button title={'4'} onPress={myTap} />
        <Button title={'5'} onPress={myTap} />
        <Button title={'6'} onPress={myTap} />
    </View>);
};  // End <Objects>


export {
    Journeys,
    Objects
};
