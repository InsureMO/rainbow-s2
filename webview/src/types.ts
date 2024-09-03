export interface Message {
	type: 'update' | 'init';
	content?: string;
}

export interface InitMessage extends Message {
	type: 'init';
	fileType: 'd9' | 'o23' | 'unknown';
}

export interface UpdateContentMessage extends Message {
	type: 'update';
}