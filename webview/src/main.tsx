import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './app';
import {
	AskContentMessage,
	AskInitPermitMessage,
	ContentChangedMessage,
	IncomingMessage,
	IncomingMessageType,
	InternalMessage,
	InternalMessageType,
	OutgoingMessageType,
	ReplyContentMessage,
	ReplyInitContentMessage,
	ThemeKind,
	TryUpdateContentMessage,
	TryUpdateThemeMessage,
	UpdateContentMessage
} from './types';

const vscode = window.acquireVsCodeApi();

// message listener must be installed before rendering
const onMessage = (event: MessageEvent<IncomingMessage | InternalMessage>) => {
	const {data} = event;
	switch (data.type) {
		case IncomingMessageType.INIT_CONTENT: {
			// get init content permit from editor provider
			console.log('%cHandle[Init permit from editor provider].', 'color:red;font-weight:bold;');
			const onContentChanged = async (content: string) => {
				// notify text provider that content changed
				vscode.postMessage<ContentChangedMessage>({type: OutgoingMessageType.CONTENT_CHANGED, content});
				console.groupCollapsed('%cHandle[content changed from editor], and send[Content changed to editor provider].', 'color:red;font-weight:bold;');
				console.table({Content: content});
				console.groupEnd();
			};
			createRoot(document.getElementById('root')!).render(<StrictMode>
				<App onContentChanged={onContentChanged}/>
			</StrictMode>);
			break;
		}
		case IncomingMessageType.UPDATE_CONTENT: {
			// update editor content when existing
			// update content passively; compare with existing content and then decide whether a page repaint is needed.
			const {fileType, content, assistantContent} = data as UpdateContentMessage;
			window.postMessage({
				type: InternalMessageType.TRY_UPDATE_CONTENT, fileType, content, assistantContent
			} as TryUpdateContentMessage);
			console.groupCollapsed('%cHandle[Update content from editor provider], and send[Try update content to editor].', 'color:red;font-weight:bold;');
			console.table({Content: content, Assistant: assistantContent});
			console.groupEnd();
			break;
		}
		case IncomingMessageType.REPLY_CONTENT: {
			// get replied content, and do initializing the editor
			// request content by 'ask-content' message and directly repaint the page
			const {fileType, content, assistantContent} = data as ReplyContentMessage;
			window.postMessage({
				type: InternalMessageType.REPLY_INIT_CONTENT, fileType, content, assistantContent
			} as ReplyInitContentMessage);
			console.groupCollapsed('%cHandle[Reply content from editor provider], and send[Reply init content to editor].', 'color:red;font-weight:bold;');
			console.table({'File Type': fileType, Content: content, Assistant: assistantContent});
			console.groupEnd();
			break;
		}
		case InternalMessageType.ASK_INIT_CONTENT: {
			vscode.postMessage<AskContentMessage>({type: OutgoingMessageType.ASK_CONTENT});
			console.log(`%cHandle[Ask init content from editor]%c, then %cSend[Ask content to editor provider].`,
				'color:red;font-weight:bold;', '', 'color:red;font-weight:bold;');
			break;
		}
		case IncomingMessageType.UPDATE_THEME: {
			const theme = (() => {
				const classList = document.body.classList;
				switch (true) {
					case classList.contains('vscode-high-contrast-light'):
						return ThemeKind.HIGH_CONTRAST_LIGHT;
					case classList.contains('vscode-light'):
						return ThemeKind.LIGHT;
					case classList.contains('vscode-high-contrast'):
						return ThemeKind.HIGH_CONTRAST_DARK;
					case classList.contains('vscode-dark'):
						return ThemeKind.DARK;
					default:
						return ThemeKind.LIGHT;
				}
			})();
			window.postMessage({type: InternalMessageType.TRY_UPDATE_THEME, theme} as TryUpdateThemeMessage);
			console.log(`%cHandle[Update theme from editor].`, 'color:red;font-weight:bold;');
			break;
		}
	}
};
window.addEventListener('message', onMessage);

// ask init permit to initialize the editor
// ask init permit from editor provider
console.log('%cSend[Ask init permit to editor provider].', 'color:red;font-weight:bold;');
vscode.postMessage<AskInitPermitMessage>({type: OutgoingMessageType.ASK_INIT_PERMIT});
