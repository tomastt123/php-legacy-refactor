<?php

function analyzePHPCode($code) {
    $deprecatedJsonPath = __DIR__ . "/deprecatedMappings.json";
    if (!file_exists($deprecatedJsonPath)) {
        return ["error" => "Deprecated mappings file not found."];
    }

    $deprecatedFunctions = json_decode(file_get_contents($deprecatedJsonPath), true);
    $results = [];

    foreach ($deprecatedFunctions as $deprecated => $replacement) {
        if (strpos($code, $deprecated) !== false) {
            echo "Found deprecated function: $deprecated\n"; // Debugging line

            $lines = explode("\n", $code);
            foreach ($lines as $lineNumber => $line) {
                if (strpos($line, $deprecated) !== false) {
                    $results[] = [
                        "line" => $lineNumber + 1,
                        "deprecated" => $deprecated,
                        "suggestion" => $replacement
                    ];
                }
            }
        }
    }

    return $results;
}
?>
