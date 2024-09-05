import {Fragment, useEffect, useState} from 'react';
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
}

const ContentHolder = (props: AppProps) => {
	const {onContentChanged} = props;

	const {on, off, fire} = useAppEventBus();
	const [state, setState] = useState<ContentState>({});
	useEffect(() => {
		const onMessage = (event: MessageEvent<InternalMessage>) => {
			const {data} = event;
			switch (data.type) {
				case InternalMessageType.TRY_UPDATE_CONTENT: {
					const {fileType: newFileType, content: newContent} = data as TryUpdateContentMessage;
					if (newFileType !== state.fileType) {
						// fire event to app, file type changed, switching editor
						setState(state => ({...state, fileType: newFileType, content: newContent}));
						fire(AppEventTypes.FILE_TYPE_CHANGED, newFileType, newContent);
					} else if (newContent !== state.content) {
						// fire event to editor, content changed
						setState(state => ({...state, content: newContent}));
						fire(AppEventTypes.CONTENT_CHANGED_BY_DOCUMENT, newContent);
					} else {
						// no change, do nothing
					}
				}
			}
		};
		const onInitContent = (fileType: FileType, content?: string) => {
			// handle event init content event
			console.log(`%cOn[Init content]%c, with [fileType=${fileType}, content=${content}], then %cFire[Content initialized].`,
				'color:red;font-weight:bold;', '', 'color:red;font-weight:bold;');
			setState(state => ({...state, fileType, content: content ?? ''}));
			fire(AppEventTypes.CONTENT_INITIALIZED, fileType);
		};
		const onAskContent = (onContent: (content?: string) => void) => {
			onContent(state.content ?? '');
		};
		const onContentChangedByEditor = async (content?: string) => {
			// handle event content changed event from editor
			setState(state => ({...state, content: content ?? ''}));
			await onContentChanged(content ?? '');
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
	}, [on, off, fire, state.fileType, state.content, onContentChanged]);

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
			return <div>
				Unknown file type. For @rainbow-d9, the file extension should be one of ".d9" or ".md". For
				@rainbow-o23, the file extension should be one of ".o23", ".yml", or ".yaml".
			</div>;
		default:
			return <Fragment/>;
	}
};

interface AppProps {
	onContentChanged: (content: string) => Promise<void>;
}

const EditorWrapper = (props: AppProps) => {
	const {onContentChanged} = props;

	const {fire} = useAppEventBus();
	useEffect(() => {
		const onMessage = (event: MessageEvent<InternalMessage>) => {
			// handle replied init content
			const {data} = event;
			switch (data.type) {
				case InternalMessageType.REPLY_INIT_CONTENT: {
					const {fileType, content} = data as ReplyInitContentMessage;
					console.log(`%cHandle[Reply init content from app]%c, with [fileType=${fileType}, content=${content}], then %cFire[Init content].`,
						'color:red;font-weight:bold;', '', 'color:red;font-weight:bold;');
					fire(AppEventTypes.INIT_CONTENT, fileType, content);
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
		<ContentHolder onContentChanged={onContentChanged}/>
		<Editor/>
	</>;
};

const App = (props: AppProps) => {
	return <AppEventBusProvider>
		<GlobalStyles/>
		<EditorWrapper {...props}/>
	</AppEventBusProvider>;
};

export default App;
