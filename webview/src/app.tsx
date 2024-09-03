import {D9VSCodeEditor} from './d9';
import {GlobalStyles} from './global-styles';
import './initializer';
import {InitMessage} from './types.ts';

const Editor = (props: AppProps) => {
	const {fileType, content} = props;

	switch (fileType) {
		case 'd9':
			return <D9VSCodeEditor content={content}/>;
		case 'o23':
		case 'unknown':
			return <div>
				Unknown file type. For @rainbow-d9, the file extension should be one of ".d9" or ".md". For
				@rainbow-o23, the file extension should be one of ".o23", ".yml", or ".yaml".
			</div>;
	}
};

interface AppProps {
	fileType: InitMessage['fileType'];
	content?: string;
}

const App = (props: AppProps) => {
	console.log(props);
	return <>
		<GlobalStyles/>
		<Editor {...props}/>
	</>;
};

export default App;
