<?php

$deprecatedJsonPath = __DIR__ . "/deprecatedMappings.json";
if (!file_exists($deprecatedJsonPath)) {
    echo json_encode(["error" => "Deprecated mappings file not found."]);
    exit(1);
}

$deprecatedFunctions = json_decode(file_get_contents($deprecatedJsonPath), true);

// Get the project directory from command-line argument
if ($argc < 2) {
    echo json_encode(["error" => "No directory provided."]);
    exit(1);
}

$directory = $argv[1];

// Function to scan PHP files recursively
function scanPhpFiles($dir) {
    $files = [];
    $rii = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));
    foreach ($rii as $file) {
        if (!$file->isDir() && $file->getExtension() === 'php') {
            $files[] = $file->getPathname();
        }
    }
    return $files;
}

$phpFiles = scanPhpFiles($directory);
$results = [];

foreach ($phpFiles as $file) {
    $lines = file($file);
    foreach ($lines as $lineNumber => $line) {
        foreach ($deprecatedFunctions as $oldFunction => $replacement) {
            if (strpos($line, $oldFunction) !== false) {
                $results[] = [
                    'file' => $file,
                    'line' => $lineNumber + 1,
                    'deprecated' => $oldFunction,
                    'suggestion' => $replacement
                ];
            }
        }
    }
}

// Output results in JSON format
echo json_encode($results, JSON_PRETTY_PRINT);
