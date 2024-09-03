import {Fragment, useEffect, useState} from 'react';
import {D9VSCodeEditor} from './d9';
import {GlobalStyles} from './global-styles';
import './initializer';
import {AskUpdateContentMessage, FileType, InternalMessage} from './types.ts';

interface AppProps {
	fileType: FileType;
	content?: string;
	onContentChanged: (content: string) => Promise<void>;
}

const ContentHolder = (props: AppProps) => {
	const [state] = useState<AppProps>(props);
	useEffect(() => {
		const onMessage = (event: MessageEvent<InternalMessage>) => {
			const {data} = event;
			switch (data.type) {
				case 'ask-update-content': {
					const {fileType: newFileType, content: newContent} = data as AskUpdateContentMessage;
					if (newFileType !== state.fileType) {
						// TODO fire event to app, file type changed, switching editor
					} else if (newContent !== state.content) {
						// TODO fire event to editor, content changed
					} else {
						// no change, do nothing
					}
				}
			}
		};
		window.addEventListener('message', onMessage);
		return () => {
			window.removeEventListener('message', onMessage);
		};
	}, [state.fileType, state.content, state.onContentChanged]);
	// TODO handle event content changed event from editor

	return <Fragment/>;
};

const Editor = (props: AppProps) => {
	const {fileType, content, onContentChanged} = props;

	const onChanged = async (content: string) => {
		// TODO fire event to content holder to change content
		console.log(content);
	};

	switch (fileType) {
		case 'd9':
			return <>
				<ContentHolder fileType={fileType} content={content} onContentChanged={onContentChanged}/>
				<D9VSCodeEditor content={content} onContentChanged={onChanged}/>
			</>;
		case 'o23':
		case 'unknown':
			return <div>
				Unknown file type. For @rainbow-d9, the file extension should be one of ".d9" or ".md". For
				@rainbow-o23, the file extension should be one of ".o23", ".yml", or ".yaml".
			</div>;
	}
};

const App = (props: AppProps) => {
	return <>
		<GlobalStyles/>
		<Editor {...props}/>
	</>;
};

export default App;
