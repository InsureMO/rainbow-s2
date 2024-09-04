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
	TryUpdateContentMessage,
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
				console.log(`%cHandle[content changed]%c, with [content=${data.content}], then %cSend[Content changed to editor provider].`,
					'color:red;font-weight:bold;', '', 'color:red;font-weight:bold;');
			};
			createRoot(document.getElementById('root')!).render(<StrictMode>
				<App onContentChanged={onContentChanged}/>
			</StrictMode>);
			break;
		}
		case IncomingMessageType.UPDATE_CONTENT: {
			// update editor content when existing
			// update content passively; compare with existing content and then decide whether a page repaint is needed.
			const {fileType, content} = data as UpdateContentMessage;
			window.postMessage({
				type: InternalMessageType.TRY_UPDATE_CONTENT, fileType, content
			} as TryUpdateContentMessage);
			console.log(`%cHandle[Update content from editor provider]%c, with [content=${data.content}], then %cSend[Try update content to editor].`,
				'color:red;font-weight:bold;', '', 'color:red;font-weight:bold;');
			break;
		}
		case IncomingMessageType.REPLY_CONTENT: {
			// get replied content, and do initializing the editor
			// request content by 'ask-content' message and directly repaint the page
			const {fileType, content} = data as ReplyContentMessage;
			window.postMessage({
				type: InternalMessageType.REPLY_INIT_CONTENT, fileType, content
			} as ReplyInitContentMessage);
			console.log(`%cHandle[Reply content from editor provider]%c, with [fileType=${fileType}, content=${data.content}], then %cSend[Reply init content to editor].`,
				'color:red;font-weight:bold;', '', 'color:red;font-weight:bold;');
			break;
		}
		case InternalMessageType.ASK_INIT_CONTENT: {
			vscode.postMessage<AskContentMessage>({type: OutgoingMessageType.ASK_CONTENT});
			console.log(`%cHandle[Ask init content from editor]%c, then %cSend[Ask content to editor provider].`,
				'color:red;font-weight:bold;', '', 'color:red;font-weight:bold;');
			break;
		}
	}
};
window.addEventListener('message', onMessage);

// ask init permit to initialize the editor
// ask init permit from editor provider
console.log('%cSend[Ask init permit to editor provider].', 'color:red;font-weight:bold;');
vscode.postMessage<AskInitPermitMessage>({type: OutgoingMessageType.ASK_INIT_PERMIT});
