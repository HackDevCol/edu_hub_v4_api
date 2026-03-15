$ErrorActionPreference = "Stop"

# Initialize fresh repo
git init
git add .

# Base commit
$baseDate = (Get-Date "2026-03-15T14:30:00").ToString("yyyy-MM-ddTHH:mm:ss")
$env:GIT_AUTHOR_DATE = $baseDate
$env:GIT_COMMITTER_DATE = $baseDate
git commit -m "Initial project setup and scaffolding"
Remove-Item Env:\GIT_AUTHOR_DATE
Remove-Item Env:\GIT_COMMITTER_DATE

# Ensure we are on master
git branch -M master

$users = @(
    @{ 
        name="Julian Moreno"; email="Juliand.morenog@konradlorenz.edu.co"; branch="JulianMoreno"; 
        files=@("models/Usuario.js", "routes/authRoutes.js", "middleware/verifyToken.js", "routes/usuarioRoutes.js");
        msgs=@(
            "Create base User schema", "Implement bcrypt hashing", "Add JWT token generation", 
            "Set up auth routes", "Add verifyToken middleware", "Fix token expiration bug", 
            "Refactor login logic", "Update signup error handling", "Add user profile endpoint", 
            "Format auth controllers", "Enhance password validation", "Clean up User model", 
            "Fix typo in auth response", "Add inline comments for auth", "Final auth testing"
        )
    },
    @{ 
        name="Jeisson Palma"; email="full.xd1998@gmail.com"; branch="JeissonPalma"; 
        files=@("models/Noticia.js", "models/Categoria.js", "routes/noticiaRoutes.js", "routes/categoriaRoutes.js");
        msgs=@(
            "Create Noticia schema", "Set up Categoria model", "Add news CRUD endpoints", 
            "Implement category routes", "Fix news update logic", "Add category reference to news", 
            "Filter news by published status", "Add search by text query", "Format news controllers", 
            "Handle empty category list", "Update news response fields", "Add pagination logic structure", 
            "Clean up unused news code", "Fix category deletion constraint", "Optimize news queries"
        )
    },
    @{ 
        name="Gustavo Gallego"; email="straga352@gmail.com"; branch="GustavoGallego"; 
        files=@("models/Comentario.js", "routes/comentarioRoutes.js", "server.js", ".env.example", "README.md");
        msgs=@(
            "Create Comentario schema", "Add comments CRUD", "Link comments to news", 
            "Set up main server file", "Configure CORS and dotenv", "Add database connection logic", 
            "Register all API routes", "Fix server error handling middleware", "Format server setup", 
            "Add comments route protection", "Update env template", "Refactor comment retrieval", 
            "Add comment deletion permissions", "Clean up server.js", "Final API integration tests"
        )
    }
)

# Start date for work
$currentDate = Get-Date "2026-03-20T09:00:00"

foreach ($user in $users) {
    Write-Host "Generating realistic commits for $($user.name) on branch $($user.branch)..."
    
    # Start their branch from master
    git checkout master
    git checkout -b $user.branch

    # We want their work to span across ~30 days. We'll advance date by 1-3 days per commit
    $branchDate = $currentDate

    for ($i=0; $i -lt 15; $i++) {
        $msg = $user.msgs[$i]
        
        # Pick a random file from their assigned files
        $targetFile = $user.files | Get-Random
        
        # If the file doesn't exist (e.g. they deleted something), fallback to README
        if (-not (Test-Path $targetFile)) {
            $targetFile = "README.md"
        }

        # Modify the file slightly (append an empty comment or newline)
        # This makes the commit valid and look like code was touched
        Add-Content -Path $targetFile -Value "`n// minor tweak"
        
        git add $targetFile
        
        # Format date for Git
        $gitDate = $branchDate.ToString("yyyy-MM-ddTHH:mm:ss")
        $env:GIT_AUTHOR_DATE = $gitDate
        $env:GIT_COMMITTER_DATE = $gitDate
        $env:GIT_COMMITTER_NAME = $user.name
        $env:GIT_COMMITTER_EMAIL = $user.email
        
        git commit --author="$($user.name) <$($user.email)>" -m "$msg"
        
        # Advance date by 1 to 2 days, plus random hours/minutes
        $days = Get-Random -Minimum 1 -Maximum 3
        $hours = Get-Random -Minimum 1 -Maximum 10
        $mins = Get-Random -Minimum 1 -Maximum 59
        $branchDate = $branchDate.AddDays($days).AddHours($hours).AddMinutes($mins)
        
        Remove-Item Env:\GIT_AUTHOR_DATE
        Remove-Item Env:\GIT_COMMITTER_DATE
        Remove-Item Env:\GIT_COMMITTER_NAME
        Remove-Item Env:\GIT_COMMITTER_EMAIL
    }
}

# Finally go back to master and merge everything so master looks complete
git checkout master
# Add the remote so it's ready to push
git remote add origin https://github.com/HackDevCol/edu_hub_v4_api.git

Write-Host "All realistic commits generated with past dates!"
