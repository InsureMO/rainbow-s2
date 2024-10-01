import {useForceUpdate} from '@rainbow-d9/n1';
import {Fragment, MutableRefObject, useEffect, useRef, useState} from 'react';
import {AppEventBusProvider, AppEventTypes, useAppEventBus} from './app-event-bus';
import {D9VSCodeEditor} from './d9-editor';
import {GlobalStyles} from './global-styles';
import './initializer';
import {O23VSCodeEditor} from './o23-editor';
import {
	FileType,
	InternalMessage,
	InternalMessageType,
	ReplyInitContentMessage,
	TryUpdateContentMessage,
	TryUpdateThemeMessage
} from './types';

interface ContentState {
	fileType?: FileType;
	content?: string;
	assistantContent?: string;
}

interface CompositionState {
	/** is IME inputting or not */
	composing: boolean;
	content?: string;
}

const ContentHolder = (props: AppProps & { composition: MutableRefObject<CompositionState> }) => {
	const {onContentChanged, composition} = props;

	const {on, off, fire} = useAppEventBus();
	const [state, setState] = useState<ContentState>({});
	useEffect(() => {
		const onMessage = (event: MessageEvent<InternalMessage>) => {
			const {data} = event;
			switch (data.type) {
				case InternalMessageType.TRY_UPDATE_CONTENT: {
					const {fileType: newFileType} = data as TryUpdateContentMessage;
					let {content: newContent, assistantContent: newAssistantContent} = data as TryUpdateContentMessage;
					newContent = (newContent ?? '').trim().replace(/\r/g, '');
					newAssistantContent = (newAssistantContent ?? '').trim().replace(/\r/g, '');
					if (newFileType !== state.fileType) {
						// fire event to app, file type changed, switching editor
						setState(state => ({
							...state, fileType: newFileType, content: newContent, assistantContent: newAssistantContent
						}));
						fire(AppEventTypes.FILE_TYPE_CHANGED, newFileType, newContent, newAssistantContent);
					} else if (newContent !== (state.content ?? '').trim()) {
						// fire event to editor, content changed
						setState(state => ({...state, content: newContent, assistantContent: newAssistantContent}));
						fire(AppEventTypes.CONTENT_CHANGED_BY_DOCUMENT, newContent, newAssistantContent);
					} else if (newAssistantContent !== (state.assistantContent ?? '').trim()) {
						// fire event to editor, content changed
						setState(state => ({...state, content: newContent, assistantContent: newAssistantContent}));
						fire(AppEventTypes.ASSISTANT_CONTENT_CHANGED_BY_DOCUMENT, newAssistantContent);
					} else {
						// no change, do nothing
					}
				}
			}
		};
		const onInitContent = (fileType: FileType, content?: string, assistantContent?: string) => {
			// handle event init content event
			console.groupCollapsed('%cOn[Init content].', 'color:red;font-weight:bold;');
			console.table({'File type': fileType, 'Content': content, 'Assistant': assistantContent});
			console.groupEnd();
			setState(state => ({...state, fileType, content: content ?? '', assistantContent}));
			fire(AppEventTypes.CONTENT_INITIALIZED, fileType);
		};
		const onAskContent = (onContent: (content?: string, assistantContent?: string) => void) => {
			onContent(state.content ?? '', state.assistantContent);
		};
		const onContentChangedByEditor = async (content?: string) => {
			if (composition.current.composing) {
				// console.log('Content change triggered by editor was ignored because of IME inputting.');
				// take content into composition ref
				composition.current.content = content ?? '';
			} else {
				// handle event content changed event from editor
				setState(state => ({...state, content: content ?? ''}));
				await onContentChanged(content ?? '');
			}
		};
		window.addEventListener('message', onMessage);
		on(AppEventTypes.INIT_CONTENT, onInitContent);
		on(AppEventTypes.ASK_CONTENT, onAskContent);
		on(AppEventTypes.CONTENT_CHANGED_BY_EDITOR, onContentChangedByEditor);
		return () => {
			window.removeEventListener('message', onMessage);
			off(AppEventTypes.INIT_CONTENT, onInitContent);
			off(AppEventTypes.ASK_CONTENT, onAskContent);
			off(AppEventTypes.CONTENT_CHANGED_BY_EDITOR, onContentChangedByEditor);
		};
	}, [on, off, fire, state.fileType, state.content, state.assistantContent, onContentChanged, composition]);

	return <Fragment/>;
};

const Editor = () => {
	const {on, off} = useAppEventBus();
	const [fileType, setFileType] = useState<FileType | null>(null);
	useEffect(() => {
		const onContentInitialized = (fileType: FileType) => {
			console.log(`%cOn[Content initialized]%c, with [fileType=${fileType}].`, 'color:red;font-weight:bold;', '');
			setFileType(fileType);
		};
		const onFileTypeChanged = (fileType: FileType) => {
			console.log(`%cOn[File type changed]%c, with [fileType=${fileType}].`, 'color:red;font-weight:bold;', '');
			setFileType(fileType);
		};
		on(AppEventTypes.CONTENT_INITIALIZED, onContentInitialized);
		on(AppEventTypes.FILE_TYPE_CHANGED, onFileTypeChanged);
		return () => {
			off(AppEventTypes.CONTENT_INITIALIZED, onContentInitialized);
			off(AppEventTypes.FILE_TYPE_CHANGED, onFileTypeChanged);
		};
	}, [on, off]);

	switch (fileType) {
		case 'd9':
			return <D9VSCodeEditor/>;
		case 'o23':
			return <O23VSCodeEditor/>;
		case 'unknown':
		default:
			return <div data-w="unknown-file-type">
				Unknown file type. For @rainbow-d9, the file extension should be one of ".d9" or ".md". For
				@rainbow-o23, the file extension should be one of ".o23", ".yml", or ".yaml".
			</div>;
	}
};

const CompositionHandler = (props: { state: MutableRefObject<CompositionState> }) => {
	const {state} = props;

	const renderRef = useRef<HTMLSpanElement>(null);
	const {fire} = useAppEventBus();
	const forceUpdate = useForceUpdate();
	useEffect(() => {
		if (renderRef.current == null) {
			return;
		}
		const previousElement = renderRef.current.previousElementSibling as HTMLDivElement | null | undefined;
		if (previousElement == null) {
			// retry after 30ms
			setTimeout(forceUpdate, 30);
			return;
		}
		const widgetType = previousElement.getAttribute('data-w');
		if (widgetType !== 'd9-page') {
			// retry after 30ms
			setTimeout(forceUpdate, 30);
			return;
		}
		const page = previousElement;
		const onCompositionStart = () => {
			state.current.composing = true;
		};
		const onCompositionEnd = () => {
			state.current.composing = false;
			if (state.current.content != null) {
				// handle content changed by composition
				fire(AppEventTypes.CONTENT_CHANGED_BY_EDITOR, state.current.content);
			}
		};
		page.addEventListener('compositionstart', onCompositionStart);
		page.addEventListener('compositionend', onCompositionEnd);
		return () => {
			page.removeEventListener('compositionstart', onCompositionStart);
			page.removeEventListener('compositionend', onCompositionEnd);
		};
	});

	return <span style={{display: 'none'}} ref={renderRef}/>;
};

interface AppProps {
	onContentChanged: (content: string) => Promise<void>;
}

const EditorWrapper = (props: AppProps) => {
	const {onContentChanged} = props;

	const compositionRef = useRef<CompositionState>({composing: false});
	const {fire} = useAppEventBus();
	useEffect(() => {
		const onMessage = (event: MessageEvent<InternalMessage>) => {
			// handle replied init content
			const {data} = event;
			switch (data.type) {
				case InternalMessageType.REPLY_INIT_CONTENT: {
					const {fileType, content, assistantContent} = data as ReplyInitContentMessage;
					console.groupCollapsed('%cHandle[Reply init content from app].', 'color:red;font-weight:bold;');
					console.table({'File type': fileType, Content: content, Assistant: assistantContent});
					console.groupEnd();
					fire(AppEventTypes.INIT_CONTENT, fileType, content, assistantContent);
					break;
				}
				case InternalMessageType.TRY_UPDATE_THEME: {
					fire(AppEventTypes.CHANGE_THEME, (data as TryUpdateThemeMessage).theme);
				}
			}
		};
		window.addEventListener('message', onMessage);
		// ask init content
		window.postMessage({type: InternalMessageType.ASK_INIT_CONTENT});
		console.log('%cSend[Ask init content to app].', 'color:red;font-weight:bold;');
		return () => {
			window.removeEventListener('message', onMessage);
		};
	}, [fire]);

	return <>
		<ContentHolder onContentChanged={onContentChanged} composition={compositionRef}/>
		<Editor/>
		<CompositionHandler state={compositionRef}/>
	</>;
};

const App = (props: AppProps) => {
	return <AppEventBusProvider>
		<GlobalStyles/>
		<EditorWrapper {...props}/>
	</AppEventBusProvider>;
};

export default App;
