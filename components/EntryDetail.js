import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { white } from '../utils/colors';
import MetricCard from './MetricCard';
import { addEntry } from '../actions'
import { removeEntry } from '../utils/api';
import { timeToString, getDailyReminderValue } from '../utils/helpers';
import TextButton from './TextButton';

class EntryDetail extends Component {
	static navigationOptions = ({ navigation }) => {
		const { entryId } = navigation.state.params;

		const year = entryId.slice(0, 4);
		const month = entryId.slice(5, 7);
		const day = entryId.slice(8);

		return {
			title: `${month}/${day}/${year}`
		}
	}

	reset = () => {
		const { remove, goBack, entryId } = this.props;

		remove();
		goBack();
		removeEntry(entryId);
	}

	// don't re-render if nextProps.metrics does not equal null
	// ie. the day has current information in it and nextProps.metrics.today is false
	// NOTE: without this event, MetricCard would re-render with null metric data
	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.metrics !== null && !nextProps.metrics.today
	}
	render() {
		const { metrics } = this.props;

		return (
			<View style={styles.container}>
				<MetricCard metrics={metrics} />
				<TextButton onPress={this.reset} style={{ margin: 20 }}>
					Reset
				</TextButton>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: white,
		padding: 15
	}
})

// entryId is going to be the key for the specific day
// passing that and the specific information about that day under metrics prop
function mapStateToProps(state, { navigation }) {
	const { entryId } = navigation.state.params;

	return {
		entryId,
		metrics: state[entryId]
	}
}

function mapDispatchToProps(dispatch, { navigation }) {
	const { entryId } = navigation.state.params;

	// if we are on today, make it whatever is returned from getDailyReminderValue()
	// otherwise, just set it to null
	return {
		remove: () => dispatch(addEntry({
			[entryId]: timeToString() === entryId
				? getDailyReminderValue()
				: null
		})),
		goBack: () => navigation.goBack(),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryDetail);