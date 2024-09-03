import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './app';
import {
	AskContentMessage,
	AskUpdateContentMessage,
	ContentChangedMessage,
	FileType,
	IncomingMessage,
	ReplyContentMessage,
	UpdateContentMessage
} from './types.ts';

const vscode = window.acquireVsCodeApi();

const updateContent = (fileType: FileType, content?: string) => {
	const onContentChanged = async (content: string) => {
		// step y, notify text document that content changed
		vscode.postMessage<ContentChangedMessage>({type: 'content-changed', content});
	};
	createRoot(document.getElementById('root')!).render(<StrictMode>
		<App fileType={fileType} content={content} onContentChanged={onContentChanged}/>
	</StrictMode>);
};
// message listener must be installed before rendering
const onMessage = (event: MessageEvent<IncomingMessage>) => {
	const {data} = event;
	switch (data.type) {
		case 'update-content': {
			// step x, update editor content when existing
			// update content passively; compare with existing content and then decide whether a page repaint is needed.
			const {fileType, content} = data as UpdateContentMessage;
			window.postMessage({type: 'ask-update-content', fileType, content} as AskUpdateContentMessage);
			console.log(`content updated with text[${data.content}].`);
			break;
		}
		case 'reply-content': {
			// step 2, get replied content, and do initializing the editor
			// request content by 'ask-content' message and directly repaint the page
			const {fileType, content} = data as ReplyContentMessage;
			updateContent(fileType, content);
			// console.log(`view updated with text[${data.content}].`);
			break;
		}
	}
};
window.addEventListener('message', onMessage);

// step 1, ask content to initialize the editor
// ask content from editor provider
vscode.postMessage<AskContentMessage>({type: 'ask-content'});
