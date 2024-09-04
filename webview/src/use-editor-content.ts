import {ObjectPropValue} from '@rainbow-d9/n1';
import {Dispatch, SetStateAction, useEffect} from 'react';
import {AppEventTypes, useAppEventBus} from './app-event-bus.tsx';

export interface EditorContentEditModel extends ObjectPropValue {
	config: string;
}

export interface EditorContentState {
	initialized: boolean;
	/** edit model for playground, carry the config content */
	editModel: EditorContentEditModel;
}

export interface UseEditorContentOptions<S extends EditorContentState> {
	state: S;
	setState: Dispatch<SetStateAction<S>>;
}

export const useEditorContent = <S extends EditorContentState>(options: UseEditorContentOptions<S>) => {
	const {state, setState} = options;

	const {on, off, fire} = useAppEventBus();
	useEffect(() => {
		const onContentChangeByDocument = (content?: string) => {
			setState(state => ({...state, initialized: true, editModel: {config: content ?? ''}}));
		};
		on(AppEventTypes.CONTENT_CHANGED_BY_DOCUMENT, onContentChangeByDocument);
		if (!state.initialized) {
			console.log(`%cFire[Ask content].`, 'color:red;font-weight:bold;');
			fire(AppEventTypes.ASK_CONTENT, onContentChangeByDocument);
		}
		return () => {
			off(AppEventTypes.CONTENT_CHANGED_BY_DOCUMENT, onContentChangeByDocument);
		};
	}, [on, off, fire, state.initialized, setState]);
};