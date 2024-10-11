// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as dotenv from "dotenv";
import * as path from "path";
import { OpenAI } from "openai";

export function activate(context: vscode.ExtensionContext) {
  // Helper function to load environment variables
  function loadEnvVariables() {
    const envFilePath = path.join(context.extensionPath, ".env");
    dotenv.config({ path: envFilePath });
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      vscode.window.showErrorMessage("API_KEY is missing from .env file.");
      throw new Error("API_KEY not found in environment variables");
    }
    return apiKey;
  }

  // Command to create tests for the file
  let disposableCreateTestsForFile = vscode.commands.registerCommand("extension.createTestsForFile", async () => {
    try {
      // Load API Key from .env
      const apiKey = loadEnvVariables();

      // Create an instance of OpenAI
      const openai = new OpenAI({ apiKey });

      // Get the content of the selected file
      const editor = vscode.window.activeTextEditor;

      if (editor == null) return;
      const document = editor.document;
      const fileText = document.getText();
      console.log("The following is file Text--------");
      console.log(fileText);

      // Send a message to OpenAI GPT model
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a knowledgeable assistant. Answer questions accurately. You will be given code to sort through and write example unit tests for. Say as much as you need. Generate NUnit tests for given c# code",
          },
          { role: "user", content: fileText },
        ],
        max_tokens: 100,
        temperature: 0.7,
      });

      // Extract and log the response
      const answer = response.choices[0].message.content;
      console.log(answer);

      // Define the file name and path to save within the workspace
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        vscode.window.showErrorMessage("No workspace folder found.");
        return;
      }

      // Save in the root of the first workspace folder
      const workspaceFolder = workspaceFolders[0].uri;
      const newFilePath = vscode.Uri.file(path.join(workspaceFolder.fsPath, "SavedTextFile.txt"));

      // Encode the text to a Uint8Array, which is required for writeFile
      const fileData = new TextEncoder().encode(answer ?? "");

      // Write the file using the VSCode filesystem API
      try {
        await vscode.workspace.fs.writeFile(newFilePath, fileData);
        vscode.window.showInformationMessage(`File saved to ${newFilePath.fsPath}`);
      } catch (err: any) {
        vscode.window.showErrorMessage(`Failed to save file: ${err.message}`);
      }
      vscode.window.showInformationMessage(`Hello: ${answer}`);
    } catch (error) {
      console.error("Error creating test:", error);
      vscode.window.showErrorMessage("Failed to create tests.");
    }
  });

  // Command to test a different function
  let disposableTestFunction = vscode.commands.registerCommand("extension.testFunction", () => {
    try {
      // Placeholder for any OpenAI API interaction
      const openai = new OpenAI({ apiKey: "" });
      // Add additional logic if needed

      console.log("Another Test was Triggered logs");
      vscode.window.showInformationMessage("Another Test was Triggered");
    } catch (error) {
      console.error("Error in testFunction:", error);
      vscode.window.showErrorMessage("Failed to run the test function.");
    }
  });

  // Add both commands to the context subscriptions
  context.subscriptions.push(disposableCreateTestsForFile);
  context.subscriptions.push(disposableTestFunction);
}

// This method is called when your extension is deactivated
export function deactivate() {}
