$files = @(
    "c:\Users\DELL\OneDrive\Desktop\eduaitutors\app\api\user\profile\route.ts",
    "c:\Users\DELL\OneDrive\Desktop\eduaitutors\app\api\user\me\route.ts",
    "c:\Users\DELL\OneDrive\Desktop\eduaitutors\app\api\schedule\route.ts",
    "c:\Users\DELL\OneDrive\Desktop\eduaitutors\app\api\quizzes\submit\route.ts",
    "c:\Users\DELL\OneDrive\Desktop\eduaitutors\app\api\quizzes\route.ts",
    "c:\Users\DELL\OneDrive\Desktop\eduaitutors\app\api\messages\route.ts",
    "c:\Users\DELL\OneDrive\Desktop\eduaitutors\app\api\lessons\progress\route.ts",
    "c:\Users\DELL\OneDrive\Desktop\eduaitutors\app\api\chat\route.ts",
    "c:\Users\DELL\OneDrive\Desktop\eduaitutors\app\api\courses\[id]\route.ts",
    "c:\Users\DELL\OneDrive\Desktop\eduaitutors\app\api\courses\route.ts",
    "c:\Users\DELL\OneDrive\Desktop\eduaitutors\app\api\admin\notices\route.ts",
    "c:\Users\DELL\OneDrive\Desktop\eduaitutors\app\api\admin\users\route.ts",
    "c:\Users\DELL\OneDrive\Desktop\eduaitutors\app\api\admin\users\details\route.ts",
    "c:\Users\DELL\OneDrive\Desktop\eduaitutors\app\api\admin\quizzes\route.ts",
    "c:\Users\DELL\OneDrive\Desktop\eduaitutors\app\api\admin\payments\route.ts",
    "c:\Users\DELL\OneDrive\Desktop\eduaitutors\app\api\admin\leads\route.ts",
    "c:\Users\DELL\OneDrive\Desktop\eduaitutors\app\api\admin\courses\route.ts",
    "c:\Users\DELL\OneDrive\Desktop\eduaitutors\app\api\admin\config\route.ts",
    "c:\Users\DELL\OneDrive\Desktop\eduaitutors\app\api\admin\admins\route.ts",
    "c:\Users\DELL\OneDrive\Desktop\eduaitutors\app\api\activities\route.ts"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        if ($content -notmatch "export const dynamic") {
            # Find the last import line
            $lines = Get-Content $file
            $lastImportIndex = -1
            for ($i = 0; $i -lt $lines.Count; $i++) {
                if ($lines[$i] -match "^import ") {
                    $lastImportIndex = $i
                }
            }
            
            if ($lastImportIndex -ge 0) {
                # Insert after the last import
                $newLines = @()
                $newLines += $lines[0..$lastImportIndex]
                $newLines += ""
                $newLines += "export const dynamic = 'force-dynamic';"
                if ($lastImportIndex + 1 -lt $lines.Count) {
                    $newLines += $lines[($lastImportIndex + 1)..($lines.Count - 1)]
                }
                $newLines | Set-Content $file
                Write-Host "Updated: $file"
            }
        }
    }
}
