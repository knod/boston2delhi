// A standard UI button
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';


const FlexButton = function ({ extraStyles, onPress, children }) {

    extraStyles = extraStyles || {};

    return (
        <TouchableOpacity
            style   = {[styles.button, extraStyles ]}
            onPress = { onPress } >

            <Text style={styles.buttonText}> { children } </Text>

        </TouchableOpacity>
    );

};  // End <FlexButton>


const styles = {
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        borderRadius: 8,
        borderColor: 'white',
        borderWidth: 1,
        backgroundColor: 'gray',
    },
    buttonText: {
        color: 'white',
        fontSize: 15,
    },
};  // end styles

export {
    FlexButton,
};