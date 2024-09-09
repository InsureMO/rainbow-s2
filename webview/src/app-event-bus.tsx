import {useCreateEventBus} from '@rainbow-d9/n1';
import {createContext, ReactNode, useContext} from 'react';
import {FileType, ThemeKind} from './types';

// eslint-disable-next-line react-refresh/only-export-components
export enum AppEventTypes {
	INIT_CONTENT = 'init-content',
	CONTENT_INITIALIZED = 'content-initialized',
	ASK_CONTENT = 'ask-content',
	FILE_TYPE_CHANGED = 'file-type-changed',
	CONTENT_CHANGED_BY_DOCUMENT = 'content-changed-by-document',
	CONTENT_CHANGED_BY_EDITOR = 'content-changed-by-editor',
	CHANGE_THEME = 'change-theme'
}

export interface PlaygroundEventBus {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	fire(type: AppEventTypes.INIT_CONTENT, fileType: FileType, content?: string, assistantContent?: any): this;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	on(type: AppEventTypes.INIT_CONTENT, listener: (fileType: FileType, content?: string, assistantContent?: any) => void): this;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	off(type: AppEventTypes.INIT_CONTENT, listener: (fileType: FileType, content?: string, assistantContent?: any) => void): this;
	fire(type: AppEventTypes.CONTENT_INITIALIZED, fileType: FileType): this;
	on(type: AppEventTypes.CONTENT_INITIALIZED, listener: (fileType: FileType) => void): this;
	off(type: AppEventTypes.CONTENT_INITIALIZED, listener: (fileType: FileType) => void): this;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	fire(type: AppEventTypes.ASK_CONTENT, onContent: (content?: string, assistantContent?: any) => void): this;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	on(type: AppEventTypes.ASK_CONTENT, listener: (onContent: (content?: string, assistantContent?: any) => void) => void): this;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	off(type: AppEventTypes.ASK_CONTENT, listener: (onContent: (content?: string, assistantContent?: any) => void) => void): this;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	fire(type: AppEventTypes.FILE_TYPE_CHANGED, fileType: FileType, content?: string, assistantContent?: any): this;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	on(type: AppEventTypes.FILE_TYPE_CHANGED, listener: (fileType: FileType, content?: string, assistantContent?: any) => void): this;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	off(type: AppEventTypes.FILE_TYPE_CHANGED, listener: (fileType: FileType, content?: string, assistantContent?: any) => void): this;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	fire(type: AppEventTypes.CONTENT_CHANGED_BY_DOCUMENT, content?: string, assistantContent?: any): this;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	on(type: AppEventTypes.CONTENT_CHANGED_BY_DOCUMENT, listener: (content?: string, assistantContent?: any) => void): this;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	off(type: AppEventTypes.CONTENT_CHANGED_BY_DOCUMENT, listener: (content?: string, assistantContent?: any) => void): this;
	fire(type: AppEventTypes.CONTENT_CHANGED_BY_EDITOR, content?: string): this;
	on(type: AppEventTypes.CONTENT_CHANGED_BY_EDITOR, listener: (content?: string) => void): this;
	off(type: AppEventTypes.CONTENT_CHANGED_BY_EDITOR, listener: (content?: string) => void): this;
	fire(type: AppEventTypes.CHANGE_THEME, theme: ThemeKind): this;
	on(type: AppEventTypes.CHANGE_THEME, listener: (theme: ThemeKind) => void): this;
	off(type: AppEventTypes.CHANGE_THEME, listener: (theme: ThemeKind) => void): this;
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAppEventBus = () => useContext(Context);
