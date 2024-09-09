export type FileType = 'd9' | 'o23' | 'unknown';

export enum IncomingMessageType {
	INIT_CONTENT = 'init-content',
	UPDATE_CONTENT = 'update-content',
	REPLY_CONTENT = 'reply-content',
	UPDATE_THEME = 'update-theme'
}

// message from editor provider to app
export interface IncomingMessage {
	type: IncomingMessageType;
}

// noinspection JSUnusedGlobalSymbols
export interface InitMessage extends IncomingMessage {
	type: IncomingMessageType.INIT_CONTENT;
}

export interface UpdateContentMessage extends IncomingMessage {
	type: IncomingMessageType.UPDATE_CONTENT;
	fileType: FileType;
	content?: string;
	assistantContent?: string;
}

export interface ReplyContentMessage extends IncomingMessage {
	type: IncomingMessageType.REPLY_CONTENT;
	fileType: FileType;
	content?: string;
	assistantContent?: string;
}

// noinspection JSUnusedGlobalSymbols
export interface ThemeChangeMessage extends IncomingMessage {
	type: IncomingMessageType.UPDATE_THEME;
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
	REPLY_INIT_CONTENT = 'reply-init-content',
	TRY_UPDATE_THEME = 'try-update-theme'
}

// message in app
export interface InternalMessage {
	type: InternalMessageType;
}

export interface TryUpdateContentMessage extends InternalMessage {
	type: InternalMessageType.TRY_UPDATE_CONTENT;
	fileType: FileType;
	content?: string;
	assistantContent?: string;
}

// noinspection JSUnusedGlobalSymbols
export interface AskInitContentMessage extends InternalMessage {
	type: InternalMessageType.ASK_INIT_CONTENT;
}

export interface ReplyInitContentMessage extends InternalMessage {
	type: InternalMessageType.REPLY_INIT_CONTENT;
	fileType: FileType;
	content?: string;
	assistantContent?: string;
}

export enum ThemeKind {
	LIGHT = 'light',
	DARK = 'dark',
	HIGH_CONTRAST_LIGHT = 'high-contrast-light',
	HIGH_CONTRAST_DARK = 'high-contrast-dark'
}

export interface TryUpdateThemeMessage extends InternalMessage {
	type: InternalMessageType.TRY_UPDATE_THEME;
	theme: ThemeKind;
}
