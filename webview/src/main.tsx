import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './app';
import {InitMessage, Message} from './types.ts';

interface VSCodeState {
	fileType: InitMessage['fileType'];
	content?: InitMessage['content'];
}

const vscode = window.acquireVsCodeApi();

const updateContent = (fileType: InitMessage['fileType'], content?: InitMessage['content']) => {
	createRoot(document.getElementById('root')!).render(<StrictMode>
		<App fileType={fileType} content={content}/>
	</StrictMode>);
};
const onMessage = (event: MessageEvent<Message>) => {
	const {data} = event;
	switch (data.type) {
		case 'init': {
			const {fileType, content} = data as InitMessage;
			updateContent(fileType, content);
			vscode.setState<VSCodeState>({fileType, content});
			// console.log(`view initialized with text[${data.content}].`);
			break;
		}
		case 'update': {
			const fileType = vscode.getState<VSCodeState>().fileType;
			const {content} = data;
			updateContent(fileType, content);
			vscode.setState<VSCodeState>({fileType, content});
			// console.log(`view updated with text[${data.content}].`);
			break;
		}
	}
};
window.addEventListener('message', onMessage);

const state = vscode.getState<VSCodeState>();
if (state) {
	console.log(`update view with state text[${state.content}].`);
	updateContent(state.fileType, state.content);
}
