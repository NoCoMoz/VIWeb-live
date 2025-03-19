<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Test file access
$testFile = __DIR__ . '/basic.html';
echo "Checking file access:<br>";
echo "File exists: " . (file_exists($testFile) ? 'Yes' : 'No') . "<br>";
echo "File readable: " . (is_readable($testFile) ? 'Yes' : 'No') . "<br>";
echo "Current permissions: " . substr(sprintf('%o', fileperms($testFile)), -4) . "<br>";

// Test directory access
echo "<br>Checking directory access:<br>";
echo "Current directory: " . __DIR__ . "<br>";
echo "Directory readable: " . (is_readable(__DIR__) ? 'Yes' : 'No') . "<br>";
echo "Directory writable: " . (is_writable(__DIR__) ? 'Yes' : 'No') . "<br>";

// Server information
echo "<br>Server information:<br>";
echo "PHP version: " . phpversion() . "<br>";
echo "Server software: " . $_SERVER['SERVER_SOFTWARE'] . "<br>";
echo "Document root: " . $_SERVER['DOCUMENT_ROOT'] . "<br>";
echo "Script filename: " . $_SERVER['SCRIPT_FILENAME'] . "<br>";

// Test Apache modules
if (function_exists('apache_get_modules')) {
    echo "<br>Apache modules:<br>";
    echo implode("<br>", apache_get_modules());
}
?>
