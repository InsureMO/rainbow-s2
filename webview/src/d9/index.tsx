import {NodeDef, StandaloneRoot} from '@rainbow-d9/n1';
import {GlobalRoot} from '@rainbow-d9/n2';
import {parseDoc} from '@rainbow-d9/n3';
import {ExternalDefsTypes} from '@rainbow-d9/n5';
import {useEffect, useState} from 'react';

const markdown = `# Page::D9 VSCode Editor
- Playground::::markdown
  - useCharts, !maxMode, !zenMode
  - externalDefs: @ext.playground.externalDefs
  - externalDefsTypes: @ext.playground.externalDefsTypes
`;

interface D9VSCodeEditorProps {
	content?: string;
}

interface D9VSCodeEditorState {
	/** node def of editor */
	def: NodeDef;
	/** markdown of editor */
	markdown: string;
	/** mock data for playground */
	mockData: any;
	/** edit model for playground */
	editModel: any;
	/** external defs for playground */
	externalDefs: any;
}

export const D9VSCodeEditor = (props: D9VSCodeEditorProps) => {
	const [state, setState] = useState<D9VSCodeEditorState>(() => {
		const mockData = {};
		const def = parseDoc(markdown).node;
		return {
			def, markdown,
			editModel: {markdown: props.content},
			externalDefs: {
				playground: {
					externalDefs: {},
					mockData: async () => mockData,
					externalDefsTypes: {} as ExternalDefsTypes
				}
			},
			mockData: {}
		};
	});
	/** handle editor markdown changed */
	useEffect(() => {
		if (markdown === state.markdown) {
			return;
		}
		setState(state => ({...state, def: parseDoc(markdown).node, markdown}));
	}, [markdown, state.markdown]);

	return <GlobalRoot>
		<StandaloneRoot {...state.def} $root={state.editModel} externalDefs={state.externalDefs}/>
	</GlobalRoot>;
};