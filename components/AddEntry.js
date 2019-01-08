import React from 'react'
import { View, TouchableOpacity, Text, Platform, StyleSheet } from 'react-native'
import { getMetricMetaInfo, getDetailsReminderValue, timeToString } from '../utils/helpers'
import UdacitySlider from './UdacitySlider'
import UdacitySteppers from './UdacitySteppers'
import DateHeader from './DateHeader'
import { Ionicons } from '@expo/vector-icons'
import TextButton from './TextButton'
import { removeEntry, submitEntry } from '../utils/api'
import { connect } from 'react-redux'
import { addEntry } from '../actions'
import { white, purple } from '../utils/colors'

function SubmitBtn({ onPress }) {
    return (
        <TouchableOpacity
            style={Platform.OS === 'ios' ? style.iosSubmitBtn : styles.androidSubmitBtn}
            onPress={onPress}>
            <Text style={styles.submitText} >SUBMIT</Text>
        </TouchableOpacity>
    )
}

class AddEntry extends React.Component {

    state = {
        run: 0,
        bike: 0,
        swim: 0,
        sleep: 0,
        eat: 0,
    }

    increment = (metric) => {
        const { max, step } = getMetricMetaInfo(metric)

        this.setState(currentState => {
            const count = currentState[metric] + step

            return {
                ...currentState,
                [metric]: count > max ? max : count
            }
        })
    }

    decrement = (metric) => {
        this.setState(currentState => {
            const count = currentState[metric] - getMetricMetaInfo(metric).step

            return {
                ...currentState,
                [metric]: count < 0 ? 0 : count
            }
        })
    }

    slide = (metric, value) => {
        this.setState({
            [metric]: value
        })
    }

    submit = () => {

        const entry = this.state

        const key = timeToString()

        this.props.dispatch(addEntry({ [key]: entry }))

        this.setState({
            run: 0,
            bike: 0,
            swim: 0,
            sleep: 0,
            eat: 0,
        })

        submitEntry({ key, entry })

        /**
         * Navigate to home
         
         * clear local notification
         */
    }

    reset = () => {
        const key = timeToString()

        this.props.dispatch(addEntry({ [key]: getDetailsReminderValue() }))

        removeEntry(key)

        /**
         * Update redix
         * route to home 
         
         */
    }

    render() {
        const metaInfo = getMetricMetaInfo()

        if (this.props.alreadyLogged) {
            return (
                <View>
                    <Ionicons
                        name="ios-happy"
                        size={100}
                    />
                    <Text>You already logged your information for today</Text>
                    <TextButton onPress={this.reset}>

                    </TextButton>
                </View>
            )
        }

        return (
            <View>
                <DateHeader date={(new Date()).toLocaleDateString()} />
                {Object.keys(metaInfo).map(key => {
                    const { getIcon, type, ...rest } = metaInfo[key]
                    const value = this.state[key]

                    return (
                        <View key={key}>
                            {metaInfo[key].getIcon()}
                            {type === 'slider' ?
                                (<UdacitySlider
                                    value={value}
                                    onChange={value => this.slide(key, value)}
                                    {...rest}
                                />)
                                : <UdacitySteppers
                                    value={value}
                                    onIncrement={() => this.increment(key)}
                                    onDecrement={() => this.decrement(key)}
                                    {...rest}
                                />
                            }
                        </View>
                    )
                })}
                <SubmitBtn onPress={this.submit} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    iosSubmitBtn: {
        backgroundColor: purple,
        padding: 10,
        borderRadius: 7,
        height: 45,
        marginLeft: 40,
        marginRight: 40
    },
    androidSubmitBtn: {
        backgroundColor: purple,
        padding: 10,
        paddingLeft: 30,
        paddingRight:30,
        height: 45,
        borderRadius:2,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center'
    },
    submitText: {
        color: white,
        fontSize: 22,
        textAlign: 'center'   
    }
})

const mapStateToProps = (state) => {
    const key = timeToString()

    return {
        alreadyLogged: state[key] && typeof state[key].today === 'undefined'
    }
}


export default connect(mapStateToProps)(AddEntry)