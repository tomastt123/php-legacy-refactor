import * as vscode from "vscode";
import { exec } from "child_process";
import * as path from "path";
import * as fs from "fs";

export function activate(context: vscode.ExtensionContext) {
    const diagnosticCollection = vscode.languages.createDiagnosticCollection("phpLegacyRefactor");
    context.subscriptions.push(diagnosticCollection);

    const runAnalysisCommand = vscode.commands.registerCommand(
        "php-legacy-refactor.runAnalysis",
        async () => {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                vscode.window.showErrorMessage("No workspace folder found.");
                return;
            }

            const projectPath = workspaceFolders[0].uri.fsPath;
            const analyzerPath = path.join(__dirname, "..", "php-analyzer", "analyze.php");

            if (!fs.existsSync(analyzerPath)) {
                vscode.window.showErrorMessage("Analyzer script not found.");
                return;
            }

            vscode.window.showInformationMessage("Running PHP analysis...");

            exec(`php "${analyzerPath}" "${projectPath}"`, (error, stdout, stderr) => {
                if (error) {
                    vscode.window.showErrorMessage(`Analysis failed: ${stderr || error.message}`);
                    return;
                }

                try {
                    const results = JSON.parse(stdout);
                    if (results.length === 0) {
                        vscode.window.showInformationMessage("✅ No deprecated code found!");
                    } else {
                        vscode.window.showInformationMessage("✅ PHP Analysis Complete.");
                        updateDiagnostics(results, diagnosticCollection);
                    }
                } catch (e) {
                    vscode.window.showErrorMessage("Failed to parse analyzer output.");
                }
            });
        }
    );

    context.subscriptions.push(runAnalysisCommand);

    // Register Hover Provider
    context.subscriptions.push(
        vscode.languages.registerHoverProvider("php", {
            provideHover(document, position) {
                const diagnostics = diagnosticCollection.get(document.uri);
                if (!diagnostics) return;

                for (const diagnostic of diagnostics) {
                    if (diagnostic.range.contains(position)) {
                        return new vscode.Hover(`⚠️ **Deprecated:** ${diagnostic.message}`);
                    }
                }
            }
        })
    );

    // Register Code Action Provider
    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider(
            "php",
            new PhpCodeActionProvider(diagnosticCollection),
            { providedCodeActionKinds: [vscode.CodeActionKind.QuickFix] }
        )
    );
}

function updateDiagnostics(results: any[], diagnosticCollection: vscode.DiagnosticCollection) {
    diagnosticCollection.clear();

    const diagnosticsMap: Map<string, vscode.Diagnostic[]> = new Map();

    results.forEach((result) => {
        const fileUri = vscode.Uri.file(result.file);
        const range = new vscode.Range(result.line - 1, 0, result.line - 1, 100);
        const message = `Deprecated function "${result.deprecated}" found. Suggested replacement: ${result.suggestion}`;

        const diagnostic = new vscode.Diagnostic(
            range,
            message,
            vscode.DiagnosticSeverity.Warning
        );

        diagnostic.code = "php-legacy-refactor.fix";

        if (!diagnosticsMap.has(result.file)) {
            diagnosticsMap.set(result.file, []);
        }
        diagnosticsMap.get(result.file)!.push(diagnostic);
    });

    diagnosticsMap.forEach((diagnostics, file) => {
        diagnosticCollection.set(vscode.Uri.file(file), diagnostics);
    });
}

// Quick Fix Provider
export class PhpCodeActionProvider implements vscode.CodeActionProvider {
    constructor(private diagnosticCollection: vscode.DiagnosticCollection) {}

    provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range
    ): vscode.CodeAction[] {
        const diagnostics = this.diagnosticCollection.get(document.uri);
        if (!diagnostics) return [];

        const actions: vscode.CodeAction[] = [];

        for (const diagnostic of diagnostics) {
            if (diagnostic.range.intersection(range)) {
                const replacement = this.getReplacement(diagnostic.message);
                if (!replacement) continue;

                const fix = new vscode.CodeAction(
                    `Replace with "${replacement}"`,
                    vscode.CodeActionKind.QuickFix
                );

                fix.edit = new vscode.WorkspaceEdit();
                fix.edit.replace(document.uri, diagnostic.range, replacement);
                fix.diagnostics = [diagnostic];

                // ✅ Ensure valid command format (avoid TS error)
                fix.command = { title: "Apply Fix", command: "" };

                actions.push(fix);
            }
        }

        return actions;
    }

    private getReplacement(message: string): string {
        const match = message.match(/Suggested replacement: (.+)/);
        return match ? match[1] : "";
    }
}

export function deactivate() {}
