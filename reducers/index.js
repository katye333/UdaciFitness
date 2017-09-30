import { RECEIVE_ENTRIES, ADD_ENTRY } from '../actions'

function entries (state = {}, action) {
	switch (action.type) {

		// keep the original state object
		// merge each new entries object into the state object
		case RECEIVE_ENTRIES:
			return {
				...state,
				...action.entries
			}

		// keep the original state object
		// merge the new entry object into the state object
		case ADD_ENTRY:
			return {
				...state,
				...action.entry
			}

		default:
			return state
	}
}

export default entries;