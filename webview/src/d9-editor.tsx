import {BridgeEventBusProvider, NodeDef, PropValue, StandaloneRoot, ValueChangedOptions} from '@rainbow-d9/n1';
import {GlobalRoot} from '@rainbow-d9/n2';
import {parseDoc} from '@rainbow-d9/n3';
import {ExternalDefsTypes, PlaygroundDecorator} from '@rainbow-d9/n5';
import {Fragment, useRef, useState} from 'react';
import {AppEventTypes, useAppEventBus} from './app-event-bus';
import {getThemeFromDOM, theme, ThemeHandler} from './theme-handler';
import {ThemeKind} from './types';
import {EditorContentState, useEditorContent} from './use-editor-content';

const markdown = `# Page::D9 VSCode Editor
- Playground::::config
  - useCharts, !maxMode, !zenMode
  - externalDefs: @ext.playground.externalDefs
  - externalDefsTypes: @ext.playground.externalDefsTypes
  - valueChanged: @ext.playground.valueChanged
  - theme: @ext.playground.decorator.theme
`;

interface D9VSCodeEditorState extends EditorContentState {
	/** node def of editor */
	def: NodeDef;
	/** markdown of editor */
	markdown: string;
	/** mock data for playground viewer */
	mockData: object;
	/** external defs for playground */
	externalDefs: object;
}

export const D9VSCodeEditor = () => {
	const {fire} = useAppEventBus();
	const themeRef = useRef<ThemeKind>(getThemeFromDOM());
	const [state, setState] = useState<D9VSCodeEditorState>(() => {
		const mockData = {};
		const def = parseDoc(markdown).node;
		// noinspection JSUnusedGlobalSymbols
		return {
			initialized: false,
			def, markdown,
			editModel: {config: ''},
			externalDefs: {
				playground: {
					externalDefs: {},
					mockData: async () => mockData,
					externalDefsTypes: {} as ExternalDefsTypes,
					valueChanged: async <NV extends PropValue>(options: ValueChangedOptions<NV>) => {
						// fire event to content holder to change content
						fire(AppEventTypes.CONTENT_CHANGED_BY_EDITOR, (options.newValue ?? '') as string);
					},
					decorator: {theme: theme(themeRef)} as PlaygroundDecorator
				}
			},
			mockData
		};
	});
	useEditorContent({state, setState});

	if (!state.initialized) {
		return <Fragment/>;
	}

	return <GlobalRoot>
		<BridgeEventBusProvider>
			<ThemeHandler theme={themeRef}/>
			<StandaloneRoot {...state.def!} $root={state.editModel!} externalDefs={state.externalDefs!}/>
		</BridgeEventBusProvider>
	</GlobalRoot>;
};