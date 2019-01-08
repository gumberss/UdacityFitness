import React, { Component } from 'react';

import { Text, View } from 'react-native'
import { purple } from '../utils/colors';
import { connect } from 'react-redux'
import { receiveEntries, addEntry } from '../actions'
import { timeToString, getDetailsReminderValue } from '../utils/helpers'
import { fetchCalendarResults } from '../utils/api'
import UdaciFitnessCalendar from 'udacifitness-calendar'

class History extends Component {

    componentDidMount() {
        const { dispatch } = this.props

        fetchCalendarResults()
            .then(entries => dispatch(receiveEntries(entries)))
            .then(({ entries }) => {
                !entries[timeToString()] && dispatch(addEntry({
                    [timeToString()]: getDetailsReminderValue()
                }))
            })
    }

    renderItem = ({ today, ...metrics }, formattedDate, key) => {
        return (<View id={JSON.stringify(today)}>
            {today
                ? <Text>{JSON.stringify(today)}</Text>
                : <Text>{JSON.stringify(metrics)}</Text>

            }
        </View>)
    }
    renderEmptyDate = (formattedDate) => {
        return (
            <View>
                <Text>No Data for this day</Text>
            </View>
        )
    }
    render() {

        const { entries } = this.props

        return (
            <UdaciFitnessCalendar
                items={entries}
                renderItem={this.renderItem}
                renderEmptyDate={this.renderEmptyDate}
            />
        );
    }
}

const mapStateToProps = entries => {
    return {
        entries
    }
}

export default connect(mapStateToProps)(History)