const externalDefs = {
	askSystemsForHttp: () => {
		return [
			{
				code: 'CodeService', name: 'Codes Service', endpoints: [
					{code: 'askCodes', name: 'Ask Codes'}
				]
			},
			{
				code: 'CacheService', name: 'Cache Service', endpoints: [
					{code: 'askCache', name: 'Ask Cache'}
				]
			}
		];
	},
	askTypeOrmDatasources: () => {
		return [
			{code: 'db-auth', name: 'Account DB'},
			{code: 'db-data', name: 'Business Data DB'}
		];
	},
	askRefPipelines: () => {
		return [
			{code: 'auth-by-token', name: 'Authenticate by token'},
			{code: 'auth-by-account', name: 'Authenticate by account'}
		];
	},
	askRefSteps: () => {
		return [
			{code: 'ask-roles', name: 'Ask user roles'},
			{code: 'ask-permissions', name: 'Ask user permissions'}
		];
	},
	test: async () => {
		return await new Promise((resolve) => {
			resolve(1);
		});
	}
};
export default externalDefs;