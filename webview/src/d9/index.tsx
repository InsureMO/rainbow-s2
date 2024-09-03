import {NodeDef, ObjectPropValue, PropValue, StandaloneRoot, ValueChangedOptions} from '@rainbow-d9/n1';
import {GlobalRoot} from '@rainbow-d9/n2';
import {parseDoc} from '@rainbow-d9/n3';
import {ExternalDefsTypes} from '@rainbow-d9/n5';
import {useState} from 'react';

const markdown = `# Page::D9 VSCode Editor
- Playground::::markdown
  - useCharts, !maxMode, !zenMode
  - externalDefs: @ext.playground.externalDefs
  - externalDefsTypes: @ext.playground.externalDefsTypes
  - valueChanged: @ext.playground.valueChanged
`;

interface D9VSCodeEditorProps {
	content?: string;
	onContentChanged: (content: string) => Promise<void>;
}

interface D9VSCodeEditorState {
	/** node def of editor */
	def: NodeDef;
	/** markdown of editor */
	markdown: string;
	/** mock data for playground viewer */
	mockData: object;
	/** edit model for playground, carry the markdown */
	editModel: ObjectPropValue;
	/** external defs for playground */
	externalDefs: object;
}

export const D9VSCodeEditor = (props: D9VSCodeEditorProps) => {
	const [state] = useState<D9VSCodeEditorState>(() => {
		const mockData = {};
		const def = parseDoc(markdown).node;
		return {
			def, markdown,
			editModel: {markdown: props.content},
			externalDefs: {
				playground: {
					externalDefs: {},
					mockData: async () => mockData,
					externalDefsTypes: {} as ExternalDefsTypes,
					valueChanged: async <NV extends PropValue>(options: ValueChangedOptions<NV>) => {
						await props.onContentChanged((options.newValue ?? '') as string);
					}
				}
			},
			mockData: {}
		};
	});
	// TODO handle content changed event, update state
	/** handle editor markdown changed */
	// useEffect(() => {
	// 	if (markdown === state.markdown) {
	// 		return;
	// 	}
	// 	setState(state => ({...state, def: parseDoc(markdown).node, markdown}));
	// }, [markdown, state.markdown]);

	return <GlobalRoot>
		<StandaloneRoot {...state.def} $root={state.editModel} externalDefs={state.externalDefs}/>
	</GlobalRoot>;
};