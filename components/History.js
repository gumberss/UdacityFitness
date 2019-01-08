import React, { Component } from 'react';

import { Text, View } from 'react-native'
import { purple } from '../utils/colors';
import { connect } from 'react-redux'
import { receiveEntries, addEntry } from '../actions'
import { timeToString, getDetailsReminderValue } from '../utils/helpers'
import { fetchCalendarResults } from '../utils/api'

class History extends Component {

    componentDidMount(){
        const { dispatch } = this.props

        fetchCalendarResults()
        .then(entries => dispatch(receiveEntries(entries)))
        .then(({ entries }) => {
            !entries[timeToString()] && dispatch(addEntry({
                [timeToString()]: getDetailsReminderValue()
            }))
        })
    }

    render() {
        return (
            <View>
                <Text>{JSON.stringify(this.props)}</Text>
            </View>
        );
    }
}

const mapStateToProps  = entries => {
    return {
        entries
    }
}

export default connect(mapStateToProps)(History)