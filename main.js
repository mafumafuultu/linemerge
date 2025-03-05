const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('extension "line-merge" is now active');

	const command = 'extension.linemerge.linemerge';

	let disposable = vscode.commands.registerCommand(command, () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		const { document, selection } = editor;
		if (selection.isEmpty || selection.isSingleLine) {
			return;
		}

		const txt = document.getText().split(/\r?\n/);
		const eol = document.eol === vscode.EndOfLine.CRLF ? '\r\n' : '\n';
		const st = selection.start.line,
			en = selection.end.line;

		const range = new vscode.Range(
			new vscode.Position(st, 0),
			new vscode.Position(en, document.lineAt(en).range.end.character)
		);

		const originalLines = txt.slice(st, en + 1);
		const replacedLines = Array.from(new Set(originalLines));
		const cnt = originalLines.length - replacedLines.length;

		if (cnt === 0) {
			vscode.window.showInformationMessage("No lines are merged");
			return;
		}

		editor.edit(e => {
			e.replace(range, replacedLines.join(eol));
		}).then(success => {
			if (success) {
				vscode.window.showInformationMessage(`Merged ${cnt} lines`);
			}
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() { }

// eslint-disable-next-line no-undef
module.exports = {
	activate,
	deactivate
}