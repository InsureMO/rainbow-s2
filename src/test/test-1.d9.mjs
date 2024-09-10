const externalDefs = {
	externalDefs: {
		codes: async () => {
			return [
				{value: '01', label: 'Option 01'},
				{value: '02', label: 'Option 02'}
			];
		},
		staticCodes: {
			gender: [
				{value: 'F', label: 'Female'},
				{value: 'M', label: 'Male'}
			],
			available: [
				{value: 'Y', label: 'Y'},
				{value: 'N', label: 'No'}
			] 
		}
	},
	mockData: async () => {
		return {hello: 'Hello', y: '01'};
	},
	externalDefsTypes: {
		codes: ['Dropdown', 'MultiDropdown', 'Checkboxes', 'Checks', 'Radios'].map($wt => ({
			$wt, properties: ['options'], label: 'Retrieve available options from remote.'
		})),

		staticCodes: {
			gender: ['Dropdown', 'MultiDropdown', 'Checkboxes', 'Checks', 'Radios'].map($wt => ({
				$wt, properties: ['options'], label: 'Gender options.'
			})),
			// avaialable
			available: ['Dropdown', 'MultiDropdown', 'Checkboxes', 'Checks', 'Radios'].map($wt => ({
				$wt, properties: ['options'], label: 'Available options.'
			}))
		}
	}
};
export default externalDefs;