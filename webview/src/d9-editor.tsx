import {BridgeEventBusProvider, NodeDef, PropValue, StandaloneRoot, ValueChangedOptions} from '@rainbow-d9/n1';
import {GlobalRoot} from '@rainbow-d9/n2';
import {parseDoc} from '@rainbow-d9/n3';
import {PlaygroundDecorator, PlaygroundDef} from '@rainbow-d9/n5';
import {Fragment, useRef, useState} from 'react';
import {AppEventTypes, useAppEventBus} from './app-event-bus';
import {getThemeFromDOM, theme, ThemeHandler} from './theme-handler';
import {ThemeKind} from './types';
import {EditorContentState, useEditorContent} from './use-editor-content';

const markdown = `# Page::D9 VSCode Editor
- Playground::::config
  - useCharts, !maxMode, !zenMode
  - externalDefs: @ext.playground.externalDefs
  - mockData: @ext.playground.mockData
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
	externalDefs: {
		playground: {
			mockData?: PlaygroundDef['mockData'];
			externalDefs?: PlaygroundDef['externalDefs'];
			externalDefsTypes?: PlaygroundDef['externalDefsTypes'];
			valueChanged: <NV extends PropValue>(options: ValueChangedOptions<NV>) => Promise<void>,
			decorator: PlaygroundDecorator;
		}
	};
}

export type D9AssistantContent = {
	mockData?: Exclude<PlaygroundDef['mockData'], VoidFunction>;
	externalDefs?: Exclude<PlaygroundDef['externalDefs'], VoidFunction>;
	externalDefsTypes?: Exclude<PlaygroundDef['externalDefsTypes'], VoidFunction>;
};

export const D9VSCodeEditor = () => {
	const {fire} = useAppEventBus();
	const themeRef = useRef<ThemeKind>(getThemeFromDOM());
	const [state, setState] = useState<D9VSCodeEditorState>(() => {
		const mockData = {};
		const def = parseDoc(markdown).node;
		// noinspection JSUnusedGlobalSymbols
		return {
			initialized: false,
			updateAssistant: (state: D9VSCodeEditorState, assistantContent?: D9AssistantContent) => {
				try {
					const {mockData, externalDefs, externalDefsTypes} = (assistantContent ?? {});
					const playground = state.externalDefs.playground;
					playground.mockData = mockData ?? {};
					playground.externalDefs = externalDefs ?? {};
					playground.externalDefsTypes = externalDefsTypes ?? {};
				} catch {
					// do nothing
				}
			},
			def, markdown,
			editModel: {config: ''},
			externalDefs: {
				playground: {
					mockData: (async () => mockData) as PlaygroundDef['mockData'],
					externalDefs: {} as PlaygroundDef['externalDefs'],
					externalDefsTypes: {} as PlaygroundDef['externalDefsTypes'],
					valueChanged: async <NV extends PropValue>(options: ValueChangedOptions<NV>) => {
						// fire event to content holder to change content
						fire(AppEventTypes.CONTENT_CHANGED_BY_EDITOR, (options.newValue ?? '') as string);
					},
					decorator: {theme: theme(themeRef)} as PlaygroundDecorator
				}
			},
			mockData
		} as D9VSCodeEditorState;
	});
	useEditorContent({state, setState});

	if (!state.initialized) {
		return <Fragment/>;
	}

	console.log('mock data', state.externalDefs.playground.mockData);
	return <GlobalRoot>
		<BridgeEventBusProvider>
			<ThemeHandler theme={themeRef}/>
			<StandaloneRoot {...state.def!} $root={state.editModel!} externalDefs={state.externalDefs!}/>
		</BridgeEventBusProvider>
	</GlobalRoot>;
};