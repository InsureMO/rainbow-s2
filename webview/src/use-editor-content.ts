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
	if (assistantContent == null || assistantContent.trim().length === 0) {
		return (void 0);
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return JSON.parse(assistantContent, (_: string, value?: any) => {
		if (value == null) {
			return null;
		} else if (typeof value === 'object' && value.$func != null) {
			if (value.$async === true) {
				return new Function(`return ${value.$func}`)();
			} else {
				return new Function(`return ${value.$func}`)();
			}
		} else {
			return value;
		}
	});
};

export const useEditorContent = <S extends EditorContentState>(options: UseEditorContentOptions<S>) => {
	const {state, setState} = options;

	const {on, off, fire} = useAppEventBus();
	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const onContent = (label: string) => (content?: string, assistantContent?: any) => {
			setState(state => {
				const newState = {...state, initialized: true, editModel: {config: content ?? ''}};
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
		on(AppEventTypes.CONTENT_CHANGED_BY_DOCUMENT, onContentChangeByDocument);
		if (!state.initialized) {
			console.log(`%cFire[Ask content].`, 'color:red;font-weight:bold;');
			fire(AppEventTypes.ASK_CONTENT, onContent('Callback[Ask content].'));
		}
		return () => {
			off(AppEventTypes.CONTENT_CHANGED_BY_DOCUMENT, onContentChangeByDocument);
		};
	}, [on, off, fire, state.initialized, setState]);
};