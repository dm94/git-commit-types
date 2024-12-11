import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "git-commit-types.showCommitOptions",
    async () => {
      const options = [
        { label: "feat: A new feature", description: "feat" },
        { label: "fix: A bug fix", description: "fix" },
        { label: "docs: Documentation only changes", description: "docs" },
        {
          label: "style: Changes that do not affect the meaning of the code",
          description: "style",
        },
        {
          label:
            "refactor: A code change that neither fixes a bug nor adds a feature",
          description: "refactor",
        },
        {
          label: "perf: A code change that improves performance",
          description: "perf",
        },
        { label: "test: Adding missing tests", description: "test" },
        {
          label: "chore: Changes to the build process or auxiliary tools",
          description: "chore",
        },
      ];

      const selectedOption = await vscode.window.showQuickPick(options, {
        placeHolder: "Select a commit type",
        canPickMany: false,
      });

      if (selectedOption) {
        const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
        const api = gitExtension?.getAPI(1);

        if (api) {
          const repository = api.repositories[0];
          if (repository?.inputBox) {
            repository.inputBox.value = `${selectedOption.description}: ${repository.inputBox.value}`.trim();
          } else {
            vscode.window.showErrorMessage("Git Commit Types: No active Git repository or input box found.");
          }
        } else {
          vscode.window.showErrorMessage("Git Commit Types: Git extension API is not available.");
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
