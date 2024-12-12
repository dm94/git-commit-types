import * as vscode from 'vscode';
import * as assert from 'assert';
import * as sinon from 'sinon';

type QuickPickItem = vscode.QuickPickItem;
type InputBox = { value: string };
type Repository = { inputBox: InputBox };
type GitAPI = { repositories: Repository[] };

const commandId = 'git-commit-types.showCommitOptions';

suite('Extension Tests', () => {
  let sandbox: sinon.SinonSandbox;

  setup(() => {
    sandbox = sinon.createSandbox();
  });

  teardown(() => {
    sandbox.restore();
  });

  test('Command is registered', async () => {
    const extension = vscode.extensions.getExtension('deeme.git-commit-types');
    if (extension && !extension.isActive) {
      await extension.activate();
    }

    const commands = await vscode.commands.getCommands(true);
    assert.ok(commands.includes(commandId), `Command ${commandId} is not registered.`);
  });

  test('QuickPick shows commit options', async () => {
    const expectedOptions: QuickPickItem[] = [
      { label: "feat: A new feature", description: "feat" },
      { label: "fix: A bug fix", description: "fix" },
      { label: "docs: Documentation only changes", description: "docs" },
      { label: "style: Changes that do not affect the meaning of the code", description: "style" },
      { label: "refactor: A code change that neither fixes a bug nor adds a feature", description: "refactor" },
      { label: "perf: A code change that improves performance", description: "perf" },
      { label: "test: Adding missing tests", description: "test" },
      { label: "chore: Changes to the build process or auxiliary tools", description: "chore" },
    ];

    const quickPickStub = sandbox.stub(vscode.window, 'showQuickPick').resolves(expectedOptions[0]);

    await vscode.commands.executeCommand(commandId);

    assert.ok(
      quickPickStub.calledOnce,
      'showQuickPick was not called exactly once.'
    );
    assert.deepStrictEqual(
      quickPickStub.firstCall.args[0],
      expectedOptions,
      'QuickPick options do not match expected values.'
    );
  });

  test('Prepend commit type to input box', async () => {
    const inputBox: InputBox = { value: 'Initial commit' };
    const repository: Repository = { inputBox };
    const gitApi: GitAPI = { repositories: [repository] };

    sandbox.stub(vscode.extensions, 'getExtension').returns({
      exports: {
        getAPI: () => gitApi,
      },
    } as unknown as vscode.Extension<unknown>);

    sandbox.stub(vscode.window, 'showQuickPick').resolves({ label: 'fix: A bug fix', description: 'fix' });

    await vscode.commands.executeCommand(commandId);

    assert.strictEqual(
      inputBox.value,
      'fix: Initial commit',
      'Commit type was not prepended to the input box value.'
    );
  });
});