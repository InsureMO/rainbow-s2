import * as vscode from 'vscode';
import {getNonce} from './utils';

export class RainbowEditorProvider implements vscode.CustomTextEditorProvider {
	public static register(context: vscode.ExtensionContext): vscode.Disposable {
		const provider = new RainbowEditorProvider(context);
		return vscode.window.registerCustomEditorProvider(RainbowEditorProvider.viewType, provider);
	}

	private static readonly viewType = 'rainbow.d9Editor';

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

		// Hook up event handlers so that we can synchronize the webview with the text document.
		// The text document acts as our model, so we have to sync change in the document to our
		// editor and sync changes in the editor back to the document.
		// Remember that a single text document can also be shared between multiple custom
		// editors (this happens for example when you split a custom editor)
		const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
			// step x, any change on document triggers this, do update anyway
			if (e.document.uri.toString() === document.uri.toString()) {
				// console.log(`update view with text[${document.getText()}].`);
				webviewPanel.webview.postMessage({
					type: 'update-content', fileType: this.getFileType(document), content: document.getText()
				});
			}
		});

		// Make sure we get rid of the listener when our editor is closed.
		webviewPanel.onDidDispose(() => {
			changeDocumentSubscription.dispose();
		});
		// Receive message from the webview.
		webviewPanel.webview.onDidReceiveMessage(e => {
			switch (e.type) {
				case 'ask-init-permit': {
					webviewPanel.webview.postMessage({type: 'init-content'});
					return;
				}
				case 'ask-content': {
					// handle the asking content for initializing the editor
					webviewPanel.webview.postMessage({
						type: 'reply-content', fileType: this.getFileType(document), content: document.getText()
					});
					return;
				}
				case 'content-changed': {
					// handle the content changed, sync to text document
					this.updateTextDocument(document, e.content);
					return;
				}
			}
		});
	}

	private getHtmlForWebview(webview: vscode.Webview): string {
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'webview', 'dist', 'assets', 'index.js'));
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
				<title>@rainbow Editor</title>
			</head>
			<body>
				<div id="root"></div>
				<script type="module" nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
	}

	/**
	 * Write out the json to a given document.
	 */
	private updateTextDocument(document: vscode.TextDocument, content: string) {
		if (document.getText() === content) {
			return;
		}
		const edit = new vscode.WorkspaceEdit();

		// Just replace the entire document every time for this example extension.
		// A more complete extension should compute minimal edits instead.
		edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), content);

		return vscode.workspace.applyEdit(edit);
	}

	private getFileType(document: vscode.TextDocument): 'd9' | 'o23' | 'unknown' {
		const filename = document.fileName;
		switch (true) {
			case filename.endsWith('.d9') :
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
