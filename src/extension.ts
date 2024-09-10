// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {RainbowEditorProvider} from './rainbow-editor-provider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Extension "rainbow-s2" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// const disposable = vscode.commands.registerCommand('rainbow-s2.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed
	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World from @rainbow/s2!');
	// });

	// context.subscriptions.push(disposable);
	// register custom editor provider
	context.subscriptions.push(RainbowEditorProvider.register(context));
	context.subscriptions.push(vscode.commands.registerCommand('rainbow.openAsD9', async (uri: vscode.Uri) => {
		await vscode.commands.executeCommand('vscode.openWith', uri, RainbowEditorProvider.viewType);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('rainbow.openAsO23', async (uri: vscode.Uri) => {
		await vscode.commands.executeCommand('vscode.openWith', uri, RainbowEditorProvider.viewType);
	}));
}

// This method is called when your extension is deactivated
// export function deactivate() {
// }
