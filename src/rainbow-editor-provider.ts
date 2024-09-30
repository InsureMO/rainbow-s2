import * as path from 'path';
import * as vscode from 'vscode';
import {getNonce} from './utils';

export class RainbowEditorProvider implements vscode.CustomTextEditorProvider {
	public static register(context: vscode.ExtensionContext): vscode.Disposable {
		const provider = new RainbowEditorProvider(context);
		return vscode.window.registerCustomEditorProvider(RainbowEditorProvider.viewType, provider);
	}

	public static readonly viewType = 'rainbow.editor';

	constructor(private readonly context: vscode.ExtensionContext) {
	}

	public async resolveCustomTextEditor(document: vscode.TextDocument, webviewPanel: vscode.WebviewPanel, _token: vscode.CancellationToken): Promise<void> {
		webviewPanel.webview.options = {
			enableScripts: true,
			// Restrict the webview to only load resources from the `dist` and `webview/build` directories
			localResourceRoots: [
				vscode.Uri.joinPath(this.context.extensionUri, 'dist'),
				vscode.Uri.joinPath(this.context.extensionUri, 'webview/dist')
			]
		};
		// webviewPanel.iconPath = vscode.Uri.joinPath(this.context.extensionUri, 'media', 'd9.svg');
		webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

		const cache = {assistantSourceCode: await this.getAssistantSourceCode(document)};
		// Hook up event handlers so that we can synchronize the webview with the text document.
		// The text document acts as our model, so we have to sync change in the document to our
		// editor and sync changes in the editor back to the document.
		// Remember that a single text document can also be shared between multiple custom
		// editors (this happens for example when you split a custom editor)
		const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(async e => {
			// step x, any change on document triggers this, do update anyway
			if (e.document.uri.toString() === document.uri.toString()) {
				webviewPanel.webview.postMessage({
					type: 'update-content',
					fileType: this.getFileType(document), content: document.getText(),
					assistantContent: cache.assistantSourceCode
				});
			} else if (!e.document.isDirty && e.document.uri.toString() === this.getAssistantDocUri(document).toString()) {
				const text = await this.getAssistantSourceCode(document);
				if (text !== cache.assistantSourceCode) {
					cache.assistantSourceCode = text;
					webviewPanel.webview.postMessage({
						type: 'update-content',
						fileType: this.getFileType(document), content: document.getText(),
						assistantContent: cache.assistantSourceCode
					});
				}
			}
		});
		const changeActiveColorThemeSubscription = vscode.window.onDidChangeActiveColorTheme(() => {
			webviewPanel.webview.postMessage({type: 'update-theme'});
		});

		// Make sure we get rid of the listener when our editor is closed.
		webviewPanel.onDidDispose(() => {
			changeDocumentSubscription.dispose();
			changeActiveColorThemeSubscription.dispose();
		});
		// Receive message from the webview.
		webviewPanel.webview.onDidReceiveMessage(async e => {
			switch (e.type) {
				case 'ask-init-permit': {
					webviewPanel.webview.postMessage({type: 'init-content'});
					return;
				}
				case 'ask-content': {
					// handle the asking content for initializing the editor
					// re-retrieve the assistant content, compare with cache
					const text = await this.getAssistantSourceCode(document);
					if (text !== cache.assistantSourceCode) {
						cache.assistantSourceCode = text;
					}
					webviewPanel.webview.postMessage({
						type: 'reply-content',
						fileType: this.getFileType(document), content: document.getText(),
						assistantContent: cache.assistantSourceCode
					});
					return;
				}
				case 'content-changed': {
					// handle the content changed, sync to text document
					await this.updateTextDocument(document, e.content);
					return;
				}
			}
		});
	}

	private async getAssistantDocUri(document: vscode.TextDocument): Promise<vscode.Uri | undefined> {
		const docUri = document.uri;
		let currentDir = path.dirname(docUri.path);
		try {
			// find assistant file in same folder
			const filename = path.basename(docUri.path);
			const dir = vscode.Uri.from({
				scheme: docUri.scheme, authority: docUri.authority, path: currentDir,
				query: docUri.query, fragment: docUri.fragment
			});
			const uri = vscode.Uri.joinPath(dir, `${filename}.mjs`);
			await vscode.workspace.fs.stat(uri);
			return uri;
		} catch {
			// find package.json for o23 only
			if (this.getFileType(document) !== 'o23') {
				return (void 0);
			}
			while (true) {
				try {
					const dir = vscode.Uri.from({
						scheme: docUri.scheme, authority: docUri.authority, path: currentDir,
						query: docUri.query, fragment: docUri.fragment
					});
					// check package.json
					let uri = vscode.Uri.joinPath(dir, 'package.json');
					await vscode.workspace.fs.stat(uri);
					// check o23 extension mjs file
					uri = vscode.Uri.joinPath(dir, '.o23.mjs');
					try {
						await vscode.workspace.fs.stat(uri);
						// exists
						return uri;
					} catch {
						// no exists
						return (void 0);
					}
				} catch {
					if (currentDir === vscode.workspace.getWorkspaceFolder(docUri)?.uri.path) {
						return (void 0);
					}
					// get parent folder
					currentDir = path.dirname(currentDir);
				}
			}
		}
	}

	/**
	 * returns empty string to represent no assistant source code
	 */
	private async getAssistantSourceCode(document: vscode.TextDocument): Promise<string> {
		try {
			let text;
			const uri = await this.getAssistantDocUri(document);
			// eslint-disable-next-line eqeqeq
			if (uri == null) {
				return '';
			}
			const doc = await vscode.workspace.openTextDocument(uri);
			if (doc.isDirty) {
				text = (await vscode.workspace.fs.readFile(uri)).toString();
			} else {
				text = doc.getText();
			}
			return (text || '').trim();
		} catch (e) {
			console.error(e);
			return '';
		}
	}

	private getHtmlForWebview(webview: vscode.Webview): string {
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'webview', 'dist', 'assets', 'index.js'));
		const cssUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'webview', 'dist', 'assets', 'index.css'));
		// Use a nonce to whitelist which scripts can be run
		const nonce = getNonce();

		return /* html */`
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
				Use a content security policy to only allow loading images from https or from our extension directory,
				and only allow scripts that have a specific nonce.
				-->
<!--				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'unsafe-inline' ${webview.cspSource}; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">-->
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link rel="stylesheet" nonce="${nonce}" href="${cssUri}">
				<title>@rainbow Editor</title>
			</head>
			<body>
				<div id="root"/>
				<script type="module" nonce="${nonce}" src="${scriptUri}"/>
			</body>
			</html>`;
	}

	/**
	 * Write out the json to a given document.
	 */
	private async updateTextDocument(document: vscode.TextDocument, content: string) {
		if (document.getText() === content) {
			return;
		}
		const edit = new vscode.WorkspaceEdit();

		// Just replace the entire document every time for this example extension.
		// A more complete extension should compute minimal edits instead.
		edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), content);
		// save anyway, since cannot retain custom editor when switching editor
		vscode.workspace.save(document.uri);
		return vscode.workspace.applyEdit(edit);
	}

	private getFileType(document: vscode.TextDocument): 'd9' | 'o23' | 'unknown' {
		const filename = document.fileName;
		switch (true) {
			case filename.endsWith('.d9'):
			case filename.endsWith('.md'):
				return 'd9';
			case filename.endsWith('.o23'):
			case filename.endsWith('.yml'):
			case filename.endsWith('.yaml'):
				return 'o23';
			default:
				return 'unknown';
		}
	}
}
