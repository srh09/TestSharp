// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { OpenAI } from 'openai';

export function activate(context: vscode.ExtensionContext) {

    // Register the first command: "Test Me"
    let disposableTestMe = vscode.commands.registerCommand('extension.testMe', () => {
        console.log('I was Tested');
        vscode.window.showInformationMessage('I was Tested');
    });

    // Register the second command: "Another Test"
    let disposableAnotherTest = vscode.commands.registerCommand('extension.anotherTest', () => {
        const openai = new OpenAI({ apiKey: '' });

        console.log('Another Test was Triggered');
        vscode.window.showInformationMessage('Another Test was Triggered');
    });

    // Add both commands to the context subscriptions
    context.subscriptions.push(disposableTestMe);
    context.subscriptions.push(disposableAnotherTest);
}

// This method is called when your extension is deactivated
export function deactivate() {}
