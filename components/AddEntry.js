import React from 'react'
import { View, Text } from 'react-native'
import { getMetricMetaInfo } from '../utils/helpers'
import UdacitySlider from './UdacitySlider'
import UdacitySteppers from './UdacitySteppers'
import DateHeader from './DateHeader'
import { Ionicons } from '@expo/vector-icons'
import TextButton from './TextButton'

export default class AddEntry extends React.Component {

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
        this.setState({
            run: 0,
            bike: 0,
            swim: 0,
            sleep: 0,
            eat: 0,
        })

        /**
         * Navigate to home
         * save to db
         * clear local notification
         */
    }

    reset = () => {
        const key = timeToString()


        /**
         * Update redix
         * route to home 
         * save in db
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
            </View>
        )
    }
}