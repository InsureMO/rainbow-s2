import {useCreateEventBus} from '@rainbow-d9/n1';
import {createContext, ReactNode, useContext} from 'react';
import {FileType} from './types';

export enum AppEventTypes {
	INIT_CONTENT = 'init-content',
	CONTENT_INITIALIZED = 'content-initialized',
	ASK_CONTENT = 'ask-content',
	FILE_TYPE_CHANGED = 'file-type-changed',
	CONTENT_CHANGED_BY_DOCUMENT = 'content-changed-by-document',
	CONTENT_CHANGED_BY_EDITOR = 'content-changed-by-editor',
}

export interface PlaygroundEventBus {
	fire(type: AppEventTypes.INIT_CONTENT, fileType: FileType, content?: string): this;
	on(type: AppEventTypes.INIT_CONTENT, listener: (fileType: FileType, content?: string) => void): this;
	off(type: AppEventTypes.INIT_CONTENT, listener: (fileType: FileType, content?: string) => void): this;
	fire(type: AppEventTypes.CONTENT_INITIALIZED, fileType: FileType): this;
	on(type: AppEventTypes.CONTENT_INITIALIZED, listener: (fileType: FileType) => void): this;
	off(type: AppEventTypes.CONTENT_INITIALIZED, listener: (fileType: FileType) => void): this;
	fire(type: AppEventTypes.ASK_CONTENT, onContent: (content?: string) => void): this;
	on(type: AppEventTypes.ASK_CONTENT, listener: (onContent: (content?: string) => void) => void): this;
	off(type: AppEventTypes.ASK_CONTENT, listener: (onContent: (content?: string) => void) => void): this;
	fire(type: AppEventTypes.FILE_TYPE_CHANGED, fileType: FileType, content?: string): this;
	on(type: AppEventTypes.FILE_TYPE_CHANGED, listener: (fileType: FileType, content?: string) => void): this;
	off(type: AppEventTypes.FILE_TYPE_CHANGED, listener: (fileType: FileType, content?: string) => void): this;
	fire(type: AppEventTypes.CONTENT_CHANGED_BY_DOCUMENT, content?: string): this;
	on(type: AppEventTypes.CONTENT_CHANGED_BY_DOCUMENT, listener: (content?: string) => void): this;
	off(type: AppEventTypes.CONTENT_CHANGED_BY_DOCUMENT, listener: (content?: string) => void): this;
	fire(type: AppEventTypes.CONTENT_CHANGED_BY_EDITOR, content?: string): this;
	on(type: AppEventTypes.CONTENT_CHANGED_BY_EDITOR, listener: (content?: string) => void): this;
	off(type: AppEventTypes.CONTENT_CHANGED_BY_EDITOR, listener: (content?: string) => void): this;
}

const Context = createContext<PlaygroundEventBus>({} as PlaygroundEventBus);
Context.displayName = 'AppEventBus';

export const AppEventBusProvider = (props: { children?: ReactNode }) => {
	const {children} = props;

	const bus = useCreateEventBus<PlaygroundEventBus>('s2-app');

	return <Context.Provider value={bus}>
		{children}
	</Context.Provider>;
};

export const useAppEventBus = () => useContext(Context);
