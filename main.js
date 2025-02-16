const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('extension "line-merge" is now active');

	const command = 'extension.linemerge.linemerge';

	let disposable = vscode.commands.registerCommand(command, () => {
		const { document, selection } = vscode.window.activeTextEditor;
		const txt = document.getText().split(/\r?\n/);
		const eol = document.eol === 1 ? '\r\n' : '\n';
		if (selection.isEmpty || selection.isSingleLine) {
			return;
		}
		const st = selection.start.line,
			en = selection.end.line;

		const originalLines = txt.slice(st, en - st + 1);
		const replacedLines = originalLines.filter((v, i, a) => a.indexOf(v) === i);
		const mergedLineCount = originalLines.length - replacedLines.length;

		// quit if no lines are merged
		if (mergedLineCount === 0) {
			vscode.window.showInformationMessage("No lines are merged");
			return;
		}

		// update text if merged any lines
		vscode.window.activeTextEditor.edit(e => {
			const st_r = document.lineAt(st).range,
				en_r = document.lineAt(en).range;
			const range = new vscode.Range(
				new vscode.Position(st_r.start.line, st_r.start.character),
				new vscode.Position(en_r.start.line, en_r.end.character)
			);
			e.replace(range, replacedLines.join(eol));
			vscode.window.showInformationMessage(`Merged ${mergedLineCount} lines`);
		}, {});
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
