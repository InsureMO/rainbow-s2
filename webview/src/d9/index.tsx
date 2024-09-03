import {StandaloneRoot} from '@rainbow-d9/n1';
import {GlobalRoot} from '@rainbow-d9/n2';
import {parseDoc} from '@rainbow-d9/n3';
import {ExternalDefsTypes} from '@rainbow-d9/n5';
import {useEffect, useState} from 'react';

export const useDef = (markdown: string) => {
	const [state, setState] = useState(() => {
		const def = parseDoc(markdown).node;
		return {def, markdown};
	});
	useEffect(() => {
		if (markdown === state.markdown) {
			return;
		}
		setState({def: parseDoc(markdown).node, markdown});
	}, [markdown, state.markdown]);

	return state.def;
};

const markdown = `# Page::D9 VSCode Editor
- Playground::::markdown
  - useCharts
  - externalDefs: @ext.playground.externalDefs
  - externalDefsTypes: @ext.playground.externalDefsTypes
`;
export const D9VSCodeEditor = () => {
	const mockData = {};
	const externalDefs = {
		playground: {
			externalDefs: {},
			mockData: async () => mockData,
			externalDefsTypes: {} as ExternalDefsTypes
		}
	};
	const def = useDef(markdown);
	const editModel = {
		markdown: `# Page`
	};

	return <GlobalRoot>
		<StandaloneRoot {...def} $root={editModel} externalDefs={externalDefs}/>
	</GlobalRoot>;
};