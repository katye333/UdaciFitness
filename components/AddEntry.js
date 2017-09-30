import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { getMetricMetaInfo, timeToString } from '../utils/helpers';
import UdaciSlider from './UdaciSlider';
import UdaciSteppers from './UdaciSteppers';
import DateHeader from './DateHeader';
import { Ionicons } from '@expo/vector-icons';
import TextButton from './TextButton';
import { submitEntry, removeEntry } from '../utils/api'

function SubmitBtn ({ onPress }) {
	return (
		<TouchableOpacity onPress={onPress}>
			<Text>Submit</Text>
		</TouchableOpacity>
	)
}

export default class AddEntry extends Component {
	state = {
		run: 0,
		bike: 0,
		swim: 0,
		sleep: 0,
		eat: 0,
	}
	increment = (metric) => {
		const { max, step } = getMetricMetaInfo(metric);

		this.setState((state) => {
			const count = state[metric] + step;

			// keep all of the original state values
			// except update the matric parameter
				// if the new value is bigger than the max, update it to the max
				// otherwise keep it at the count value
			return {
				...state,
				[metric]: count > max ? max : count
			};
		})
	}

	decrement = (metric) => {

		this.setState((state) => {
			const count = state[metric] - getMetricMetaInfo(metric).step;

			return {
				...state,
				[metric]: count < 0 ? 0 : count
			}
		})
	}

	slide = (metric, value) => {
		this.setState(() => ({
			[metric]: value,
		}))
	}

	submit = () => {
		const key = timeToString();
		const entry = this.state;

		// TODO: Update Redux

		// Reset local state
		this.setState(() => ({
			run: 0,
			bike: 0,
			swim: 0,
			sleep: 0,
			eat: 0,
		}))

		// TODO: Navigate to Home

		submitEntry({ key, entry });

		// TODO: Clear local notifications
	}

	reset = () => {
		const key = timeToString();

		// TODO: Update Redux
		// TODO: Route to Home

		removeEntry(key)
	}

	render() {
		const metaInfo = getMetricMetaInfo();

		if (this.props.alreadyLogged) {
			return (
				<View>
					<Ionicons
						name='ios-happy-outline'
						size={100} />

					<Text>You already logged your information for today</Text>
					<TextButton onPress={this.reset}>
						Reset
					</TextButton>
				</View>
			)
		}

		return (
			<View>
				<DateHeader date={(new Date()).toLocaleDateString()} />
				{Object.keys(metaInfo).map((key) => {
					const { getIcon, type, ...rest } = metaInfo[key]
					const value = this.state[key]

					return (
						<View key={key}>
							{getIcon()}
							{type === 'slider'
								? <UdaciSlider
									value={value}
									onChange={(value) => this.slide(key, value)}
									{...rest} />
								: <UdaciSteppers
									value={value}
									onIncrement={() => this.increment(key)}
									onDecrement={() => this.decrement(key)} />
							}
						</View>
					)
				})}
				<SubmitBtn onPress={this.submit} />
			</View>
		)
	}
}