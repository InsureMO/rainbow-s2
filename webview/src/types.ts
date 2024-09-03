export type FileType = 'd9' | 'o23' | 'unknown';

export interface IncomingMessage {
	type: 'update-content' | 'init-content' | 'reply-content';
	content?: string;
}

export interface UpdateContentMessage extends IncomingMessage {
	type: 'update-content';
	fileType: FileType;
}

export interface ReplyContentMessage extends IncomingMessage {
	type: 'reply-content';
	fileType: FileType;
}

export interface OutgoingMessage {
	type: 'ask-content' | 'content-changed';
}

export interface AskContentMessage extends OutgoingMessage {
	type: 'ask-content';
}

export interface ContentChangedMessage extends OutgoingMessage {
	type: 'content-changed';
	content: string;
}

export interface InternalMessage {
	type: 'ask-update-content';
}

export interface AskUpdateContentMessage extends InternalMessage {
	type: 'ask-update-content';
	fileType: FileType;
	content?: string;
}
