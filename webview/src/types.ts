export type FileType = 'd9' | 'o23' | 'unknown';

export enum IncomingMessageType {
	INIT_CONTENT = 'init-content',
	UPDATE_CONTENT = 'update-content',
	REPLY_CONTENT = 'reply-content'
}

// message from editor provider to app
export interface IncomingMessage {
	type: IncomingMessageType;
	content?: string;
}

export interface InitMessage extends IncomingMessage {
	type: IncomingMessageType.INIT_CONTENT;
}

export interface UpdateContentMessage extends IncomingMessage {
	type: IncomingMessageType.UPDATE_CONTENT;
	fileType: FileType;
}

export interface ReplyContentMessage extends IncomingMessage {
	type: IncomingMessageType.REPLY_CONTENT;
	fileType: FileType;
}

export enum OutgoingMessageType {
	ASK_INIT_PERMIT = 'ask-init-permit',
	ASK_CONTENT = 'ask-content',
	CONTENT_CHANGED = 'content-changed'
}

// message from app to editor provider
export interface OutgoingMessage {
	type: OutgoingMessageType;
}

export interface AskInitPermitMessage extends OutgoingMessage {
	type: OutgoingMessageType.ASK_INIT_PERMIT;
}

export interface AskContentMessage extends OutgoingMessage {
	type: OutgoingMessageType.ASK_CONTENT;
}

export interface ContentChangedMessage extends OutgoingMessage {
	type: OutgoingMessageType.CONTENT_CHANGED;
	content: string;
}

export enum InternalMessageType {
	TRY_UPDATE_CONTENT = 'try-update-content',
	ASK_INIT_CONTENT = 'ask-init-content',
	REPLY_INIT_CONTENT = 'reply-init-content'
}

// message in app
export interface InternalMessage {
	type: InternalMessageType;
}

export interface TryUpdateContentMessage extends InternalMessage {
	type: InternalMessageType.TRY_UPDATE_CONTENT;
	fileType: FileType;
	content?: string;
}

export interface AskInitContentMessage extends InternalMessage {
	type: InternalMessageType.ASK_INIT_CONTENT;
}

export interface ReplyInitContentMessage extends InternalMessage {
	type: InternalMessageType.REPLY_INIT_CONTENT;
	fileType: FileType;
	content?: string;
}
