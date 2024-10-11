// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { OpenAI } from 'openai';

export function activate(context: vscode.ExtensionContext) {

    // Register the first command: "Test Me"
    let disposableTestMe = vscode.commands.registerCommand('extension.testMe', async () => {
        // Load .env file
        const envFilePath = path.join(context.extensionPath, '.env');
        dotenv.config({ path: envFilePath });

        // Access the API_KEY from the environment variables
        const API_KEY = process.env.API_KEY;

        const openai = new OpenAI({ apiKey: API_KEY })
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {"role": "system", "content": "You are a knowledgeable assistant. Answer questions accurately. You will be given code to sort through and write example unit tests for. Say as much as you need"},
              { role: "user", content: "Say Hello back for my test please." }],
            max_tokens: 100,
            temperature: 0.7,
          });
        const answer = response.choices[0].message.content
        console.log(answer)   
        console.log('I was Tested');
        vscode.window.showInformationMessage(`Hello: ${answer}`);
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
