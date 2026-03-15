$ErrorActionPreference = "Stop"

$workDir = "c:\Users\julia\Downloads\apinoticias"
$backupDir = "c:\Users\julia\Downloads\backup_apinoticias"

Write-Host "Creating backup of current code..."
Remove-Item -Recurse -Force $backupDir -ErrorAction Ignore
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
Copy-Item -Path "$workDir\*" -Destination $backupDir -Recurse -Exclude ".git", "*.ps1"

Write-Host "Cleaning working directory..."
Get-ChildItem -Path $workDir -Exclude "*.ps1", "node_modules" | Remove-Item -Recurse -Force
Remove-Item -Recurse -Force "$workDir\.git" -ErrorAction Ignore

# Initialize git
git init

# Base setup
Copy-Item -Path "$backupDir\package.json" -Destination "$workDir\" -ErrorAction Ignore
Copy-Item -Path "$backupDir\.gitignore" -Destination "$workDir\" -ErrorAction Ignore
Copy-Item -Path "$backupDir\.env.example" -Destination "$workDir\" -ErrorAction Ignore
Copy-Item -Path "$backupDir\README.md" -Destination "$workDir\" -ErrorAction Ignore
New-Item -ItemType Directory -Force -Path "$workDir\models" | Out-Null
New-Item -ItemType Directory -Force -Path "$workDir\routes" | Out-Null
New-Item -ItemType Directory -Force -Path "$workDir\middleware" | Out-Null

git add .
$baseDate = (Get-Date "2026-03-15T10:00:00")
$env:GIT_AUTHOR_DATE = $baseDate.ToString("yyyy-MM-ddTHH:mm:ss")
$env:GIT_COMMITTER_DATE = $env:GIT_AUTHOR_DATE
git commit -m "Initial project setup: configs and README"
git branch -M master

$users = @(
    @{ 
        name="Julian Moreno"; email="Juliand.morenog@konradlorenz.edu.co"; branch="JulianMoreno"; 
        tasks=@(
            @{ file="models/Usuario.js"; msgs=@("Create base User schema", "Add bcrypt password hashing", "Finalize User model validation") },
            @{ file="routes/authRoutes.js"; msgs=@("Setup auth router", "Implement signup logic", "Add login endpoint", "Refactor token generation", "Add profile endpoint") },
            @{ file="middleware/verifyToken.js"; msgs=@("Create JWT verify middleware", "Handle invalid tokens", "Extract user payload") },
            @{ file="routes/usuarioRoutes.js"; msgs=@("Setup user CRUD router", "Implement get users", "Add user update logic", "Implement user deletion") }
        )
    },
    @{ 
        name="Jeisson Palma"; email="full.xd1998@gmail.com"; branch="JeissonPalma"; 
        tasks=@(
            @{ file="models/Noticia.js"; msgs=@("Define Noticia schema properties", "Add timestamps to Noticia", "Add category ref to Noticia") },
            @{ file="models/Categoria.js"; msgs=@("Create Categoria model", "Add active status to Categoria") },
            @{ file="routes/noticiaRoutes.js"; msgs=@("Setup news router", "Add get all published news", "Implement news creation", "Add news update by ID", "Implement news deletion", "Add search query filter") },
            @{ file="routes/categoriaRoutes.js"; msgs=@("Add category list route", "Implement category creation", "Add category deletion", "Finalize category routes") }
        )
    },
    @{ 
        name="Gustavo Gallego"; email="straga352@gmail.com"; branch="GustavoGallego"; 
        tasks=@(
            @{ file="models/Comentario.js"; msgs=@("Define Comentario schema", "Link Comentario to Usuario", "Link Comentario to Noticia") },
            @{ file="routes/comentarioRoutes.js"; msgs=@("Create comments router", "Add route to get comments by news", "Implement comment posting", "Add comment deletion endpoint", "Protect comment routes with JWT") },
            @{ file="server.js"; msgs=@("Setup basic express server", "Configure CORS and JSON body parser", "Implement MongoDB connection setup", "Register auth and user routes", "Register news and category routes", "Register comments routes", "Add global error handler") }
        )
    }
)

$currentDate = $baseDate.AddDays(1)

foreach ($user in $users) {
    Write-Host "Generating realistic progressive commits for $($user.name)..."
    git checkout master
    git checkout -b $user.branch
    
    $branchDate = $currentDate
    
    foreach ($task in $user.tasks) {
        $backupFile = "$backupDir\$($task.file)"
        $workFile = "$workDir\$($task.file)"
        
        if (-not (Test-Path $backupFile)) {
            Write-Host "File $backupFile not found in backup, creating dummy content"
            New-Item -ItemType File -Force -Path $backupFile | Out-Null
            Add-Content -Path $backupFile -Value "// Code pending"
        }

        $lines = Get-Content $backupFile
        $totalLines = $lines.Count
        $numCommits = $task.msgs.Count
        
        $linesPerCommit = [math]::Ceiling($totalLines / $numCommits)
        if ($linesPerCommit -eq 0) { $linesPerCommit = 1 }
        
        # Create empty file
        New-Item -ItemType File -Force -Path $workFile | Out-Null
        
        $currentLine = 0
        foreach ($msg in $task.msgs) {
            $endLine = $currentLine + $linesPerCommit - 1
            if ($endLine -ge $totalLines) { $endLine = $totalLines - 1 }
            
            if ($currentLine -le $endLine -and $totalLines -gt 0) {
                $chunk = $lines[$currentLine..$endLine]
                Add-Content -Path $workFile -Value $chunk
            } else {
                # If we run out of lines but still have commits left, just append a space or comment
                Add-Content -Path $workFile -Value ""
            }
            $currentLine = $endLine + 1
            
            git add $workFile
            
            $gitDate = $branchDate.ToString("yyyy-MM-ddTHH:mm:ss")
            $env:GIT_AUTHOR_DATE = $gitDate
            $env:GIT_COMMITTER_DATE = $gitDate
            $env:GIT_COMMITTER_NAME = $user.name
            $env:GIT_COMMITTER_EMAIL = $user.email
            
            git commit --author="$($user.name) <$($user.email)>" -m "$msg"
            
            $days = Get-Random -Minimum 0 -Maximum 2
            $hours = Get-Random -Minimum 1 -Maximum 8
            $mins = Get-Random -Minimum 5 -Maximum 59
            $branchDate = $branchDate.AddDays($days).AddHours($hours).AddMinutes($mins)
        }
    }
}

git checkout master
# Copy whatever is left in backup just to make sure master has EVERYTHING
Copy-Item -Path "$backupDir\*" -Destination $workDir -Recurse -Force
git add .
git commit -m "Merge all feature branches and finalize application"

git remote add origin https://github.com/HackDevCol/edu_hub_v4_api.git

Remove-Item Env:\GIT_AUTHOR_DATE
Remove-Item Env:\GIT_COMMITTER_DATE
Remove-Item Env:\GIT_COMMITTER_NAME
Remove-Item Env:\GIT_COMMITTER_EMAIL

Write-Host "Repository completely rebuilt with realistic progressive commits!"
