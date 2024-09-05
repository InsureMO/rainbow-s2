import {BridgeEventBusProvider, NodeDef, PropValue, StandaloneRoot, ValueChangedOptions} from '@rainbow-d9/n1';
import {GlobalRoot} from '@rainbow-d9/n2';
import {parseDoc} from '@rainbow-d9/n3';
import {PlaygroundDecorator} from '@rainbow-d9/n5';
import {PlaygroundModuleAssistant} from '@rainbow-d9/n6';
import {Fragment, useRef, useState} from 'react';
import {AppEventTypes, useAppEventBus} from './app-event-bus';
import {getThemeFromDOM, theme, ThemeHandler} from './theme-handler';
import {ThemeKind} from './types';
import {EditorContentState, useEditorContent} from './use-editor-content';

const markdown = `# Page::O23 VSCode Editor
- O23Playground::::config
  - allowDownloadImage, !allowDownloadFile, !allowUploadFile, !maxMode, !zenMode
  - httpSystems: @ext.playground.httpSystems
  - typeOrmDatasources: @ext.playground.typeOrmDatasources
  - refPipelines: @ext.playground.refPipelines
  - refSteps: @ext.playground.refSteps
  - valueChanged: @ext.playground.valueChanged
  - theme: @ext.playground.decorator.theme
`;

interface O23VSCodeEditorState extends EditorContentState {
	/** node def of editor */
	def: NodeDef;
	/** markdown of editor */
	markdown: string;
	/** external defs for playground */
	externalDefs: object;
}

export const O23VSCodeEditor = () => {
	const {fire} = useAppEventBus();
	const themeRef = useRef<ThemeKind>(getThemeFromDOM());
	const [state, setState] = useState<O23VSCodeEditorState>(() => {
		const def = parseDoc(markdown).node;
		// noinspection JSUnusedGlobalSymbols
		return {
			initialized: false,
			def, markdown,
			editModel: {config: ''},
			externalDefs: {
				playground: {
					httpSystems: (() => {
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
					}) as PlaygroundModuleAssistant['askSystemsForHttp'],
					typeOrmDatasources: (() => {
						return [
							{code: 'db-auth', name: 'Account DB'},
							{code: 'db-data', name: 'Business Data DB'}
						];
					}) as PlaygroundModuleAssistant['askTypeOrmDatasources'],
					refPipelines: (() => {
						return [
							{code: 'auth-by-token', name: 'Authenticate by token'},
							{code: 'auth-by-account', name: 'Authenticate by account'}
						];
					}) as PlaygroundModuleAssistant['askRefPipelines'],
					refSteps: (() => {
						return [
							{code: 'ask-roles', name: 'Ask user roles'},
							{code: 'ask-permissions', name: 'Ask user permissions'}
						];
					}) as PlaygroundModuleAssistant['askRefSteps'],
					valueChanged: async <NV extends PropValue>(options: ValueChangedOptions<NV>) => {
						// fire event to content holder to change content
						fire(AppEventTypes.CONTENT_CHANGED_BY_EDITOR, (options.newValue ?? '') as string);
					},
					decorator: {theme: theme(themeRef)} as PlaygroundDecorator
				}
			}
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