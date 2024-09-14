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
		},
		clickMe: () => {
			// asdlkfal;sdkgha;dlgkh
			console.log('do something');
			alert('do something');
		}
	},
	mockData: async () => {
		return {
			"hello": "Hello world",
			"y": "02"
		  };
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
		},
		clickMe: [{$wt: 'Button', properties: ['click'], label: 'click handler.'}]
	}
};
export default externalDefs;