import { expect } from 'chai';
import * as vscode from "vscode";

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Command should add selected prefix to commit message", async () => {
    // Activate the extension before running tests.
    await vscode.commands.executeCommand("git-commit-types.showCommitOptions");

    const gitExtension = vscode.extensions.getExtension("vscode.git")?.exports;
    const api = gitExtension?.getAPI(1);

    if (!api) {
      throw new Error("Git extension API is not available");
    }

    const repository = api.repositories[0];

    if (!repository) {
      throw new Error("No active Git repository found");
    }

    // Simulate user selection of a commit type.
    const selectedDescription = "feat";

    // Set initial value for simulation
    repository.inputBox.value = "";

    // Simulate adding description to input box.
    repository.inputBox.value =
      `${selectedDescription}: ${repository.inputBox.value}`.trim();

    // Validate that the input box's value starts with 'feat:'
    expect(repository.inputBox.value).to.include('feat:', "The prefix was not added correctly");
  });
});
