// Page for users to select journeys

import React, { Component } from 'react';
import { Transition, Image } from 'semantic-ui-react';
import { Button, View } from 'react-native';

// OURS
import { JourneyManager } from './JourneyManager';

class Journeys extends Component {
    state = {which: 'choices'}

    onTap = (evnt, action) => {
        if ( action === 'goToJourney' ) { this.setState({which: 'journey'}) }
        else { this.setState({which: 'choices'}) }
    }

    render () {

        var onTap = this.onTap;
        if ( this.state.which === 'journey' ) {
            return <JourneyManager path={'something'} style={{ flex: 1 }} />
        } else {
            return <FirstChoices onTap={onTap} style={{ flex: 1 }} />
        }

    }
};  // End <Journeys>


const FirstChoices = function ({ onTap }) {

    var myTap = (evnt) => {
        onTap(evnt, 'goToJourney');
    }

    return (<View className={'opening-choice'} centered size={'mini'}>
        <Button title={'1'} onPress={myTap} />
        <Button title={'2'} onPress={myTap} />
        <Button title={'3'} onPress={myTap} />
        <Button title={'4'} onPress={myTap} />
        <Button title={'5'} onPress={myTap} />
        <Button title={'6'} onPress={myTap} />
    </View>);
};  // End <FirstChoices>


export {
    Journeys,
    FirstChoices
};
