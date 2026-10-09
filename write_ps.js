const fs = require('fs');
const { execSync } = require('child_process');

const psScript = `
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead('D:\\Riset_BIMA\\vps_version\\Instrumen_Think_Aloud_3_Sesi.docx')
$entry = $zip.Entries | Where-Object { $_.FullName -eq 'word/document.xml' }
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$text = $reader.ReadToEnd()
$reader.Close()
$stream.Close()
$zip.Dispose()
$cleanText = $text -replace '<[^>]+>', ' '
[System.IO.File]::WriteAllText('D:\\Riset_BIMA\\vps_version\\deploy\\doc_3sesi.txt', $cleanText)
`;

fs.writeFileSync('D:\\Riset_BIMA\\vps_version\\deploy\\parse_doc.ps1', psScript);
console.log('Script written.');
