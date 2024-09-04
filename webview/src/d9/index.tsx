import {NodeDef, ObjectPropValue, PropValue, StandaloneRoot, ValueChangedOptions} from '@rainbow-d9/n1';
import {GlobalRoot} from '@rainbow-d9/n2';
import {parseDoc} from '@rainbow-d9/n3';
import {ExternalDefsTypes} from '@rainbow-d9/n5';
import {Fragment, useEffect, useState} from 'react';
import {AppEventTypes, useAppEventBus} from '../app-event-bus.tsx';

const markdown = `# Page::D9 VSCode Editor
- Playground::::markdown
  - useCharts, !maxMode, !zenMode
  - externalDefs: @ext.playground.externalDefs
  - externalDefsTypes: @ext.playground.externalDefsTypes
  - valueChanged: @ext.playground.valueChanged
`;

interface D9VSCodeEditorState {
	initialized: boolean;
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

export const D9VSCodeEditor = () => {
	const {on, off, fire} = useAppEventBus();
	const [state, setState] = useState<D9VSCodeEditorState>(() => {
		const mockData = {};
		const def = parseDoc(markdown).node;
		return {
			initialized: false,
			def, markdown,
			editModel: {markdown: ''},
			externalDefs: {
				playground: {
					externalDefs: {},
					mockData: async () => mockData,
					externalDefsTypes: {} as ExternalDefsTypes,
					valueChanged: async <NV extends PropValue>(options: ValueChangedOptions<NV>) => {
						// fire event to content holder to change content
						fire(AppEventTypes.CONTENT_CHANGED_BY_EDITOR, (options.newValue ?? '') as string);
					}
				}
			},
			mockData
		};
	});
	useEffect(() => {
		const onContentChangeByDocument = (content?: string) => {
			setState(state => ({...state, initialized: true, editModel: {markdown: content ?? ''}}));
		};
		on(AppEventTypes.CONTENT_CHANGED_BY_DOCUMENT, onContentChangeByDocument);
		if (!state.initialized) {
			console.log(`%Fire[Ask content].`, 'color:red;font-weight:bold;');
			fire(AppEventTypes.ASK_CONTENT, onContentChangeByDocument);
		}
		return () => {
			off(AppEventTypes.CONTENT_CHANGED_BY_DOCUMENT, onContentChangeByDocument);
		};
	}, []);

	if (!state.initialized) {
		return <Fragment/>;
	}

	return <GlobalRoot>
		<StandaloneRoot {...state.def!} $root={state.editModel!} externalDefs={state.externalDefs!}/>
	</GlobalRoot>;
};