import {ObjectPropValue} from '@rainbow-d9/n1';
import {Dispatch, SetStateAction, useEffect} from 'react';
import {AppEventTypes, useAppEventBus} from './app-event-bus';

export interface EditorContentEditModel extends ObjectPropValue {
	config: string;
}

export interface EditorContentState {
	initialized: boolean;
	/** edit model for playground, carry the config content */
	editModel: EditorContentEditModel;
	updateAssistant: <S, A>(state: S, assistantContent?: A) => void;
}

export interface UseEditorContentOptions<S extends EditorContentState> {
	state: S;
	setState: Dispatch<SetStateAction<S>>;
}

const deserializeAssistant = (assistantContent?: string) => {
	console.groupCollapsed(`%c[Parse assistant content]`, 'color:red;font-weight:bold;');
	console.log(assistantContent);
	console.groupEnd();
	if (assistantContent == null || assistantContent.trim().length === 0) {
		return (void 0);
	}
	return new Function(assistantContent.replace('export default', 'return'))();
};

export const useEditorContent = <S extends EditorContentState>(options: UseEditorContentOptions<S>) => {
	const {state, setState} = options;

	const {on, off, fire} = useAppEventBus();
	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const onContent = (label: string) => (content?: string, assistantContent?: any) => {
			setState(state => {
				const newState = {...state, initialized: true};
				// keep the original edit model
				newState.editModel.config = content ?? '';
				// handle assistant content
				const assistant = deserializeAssistant(assistantContent);
				console.groupCollapsed(`%c${label}`, 'color:red;font-weight:bold;');
				console.table({Content: content, Assistant: assistant, 'Assistant Content': assistantContent});
				console.groupEnd();
				newState.updateAssistant(newState, assistant);
				return newState;
			});
		};
		const onContentChangeByDocument = onContent('On[Content changed from editor provider].');
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const onAssistantContent = (label: string) => (assistantContent?: any) => {
			setState(state => {
				const newState = {...state, initialized: true};
				// handle assistant content
				const assistant = deserializeAssistant(assistantContent);
				console.groupCollapsed(`%c${label}`, 'color:red;font-weight:bold;');
				console.table({Assistant: assistant, 'Assistant Content': assistantContent});
				console.groupEnd();
				newState.updateAssistant(newState, assistant);
				return newState;
			});
		};
		const onAssistantContentChangeByDocument = onAssistantContent('On[Assistant content changed from editor provider].');
		on(AppEventTypes.CONTENT_CHANGED_BY_DOCUMENT, onContentChangeByDocument);
		on(AppEventTypes.ASSISTANT_CONTENT_CHANGED_BY_DOCUMENT, onAssistantContentChangeByDocument);
		if (!state.initialized) {
			console.log(`%cFire[Ask content].`, 'color:red;font-weight:bold;');
			fire(AppEventTypes.ASK_CONTENT, onContent('Callback[Ask content].'));
		}
		return () => {
			off(AppEventTypes.CONTENT_CHANGED_BY_DOCUMENT, onContentChangeByDocument);
			off(AppEventTypes.ASSISTANT_CONTENT_CHANGED_BY_DOCUMENT, onAssistantContentChangeByDocument);
		};
	}, [on, off, fire, state.initialized, setState]);
};
