import * as vscode from 'vscode';
import {getNonce} from './utils';

export class D9EditorProvider implements vscode.CustomTextEditorProvider {
	public static register(context: vscode.ExtensionContext): vscode.Disposable {
		const provider = new D9EditorProvider(context);
		return vscode.window.registerCustomEditorProvider(D9EditorProvider.viewType, provider);
	}

	private static readonly viewType = 'rainbow.d9Editor';

	constructor(private readonly context: vscode.ExtensionContext) {
	}

	public async resolveCustomTextEditor(document: vscode.TextDocument, webviewPanel: vscode.WebviewPanel, token: vscode.CancellationToken): Promise<void> {
		webviewPanel.webview.options = {
			enableScripts: true,
			// Restrict the webview to only load resources from the `dist` and `webview/build` directories
			localResourceRoots: [
				vscode.Uri.joinPath(this.context.extensionUri, 'dist'),
				vscode.Uri.joinPath(this.context.extensionUri, 'media'),
				vscode.Uri.joinPath(this.context.extensionUri, 'webview/dist')
			]
		};
		// webviewPanel.iconPath = vscode.Uri.joinPath(this.context.extensionUri, 'media', 'd9.svg');
		webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

		const updateWebview = () => {
			webviewPanel.webview.postMessage({type: 'update', text: document.getText()});
		};
		// Hook up event handlers so that we can synchronize the webview with the text document.
		// The text document acts as our model, so we have to sync change in the document to our
		// editor and sync changes in the editor back to the document.
		// Remember that a single text document can also be shared between multiple custom
		// editors (this happens for example when you split a custom editor)
		const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
			if (e.document.uri.toString() === document.uri.toString()) {
				updateWebview();
			}
		});

		// Make sure we get rid of the listener when our editor is closed.
		webviewPanel.onDidDispose(() => {
			changeDocumentSubscription.dispose();
		});
		// Receive message from the webview.
		// webviewPanel.webview.onDidReceiveMessage(e => {
		// 	switch (e.type) {
		// 		case 'add':
		// 			this.addNewScratch(document);
		// 			return;
		//
		// 		case 'delete':
		// 			this.deleteScratch(document, e.id);
		// 			return;
		// 	}
		// });

		updateWebview();
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
				<title>@rainbow/d9 Editor</title>
			</head>
			<body>
				<div id="root"></div>
				<script type="module" nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
	}
}
