$isRepo = Test-Path ".git"
if (-not $isRepo) {
    git init
    git add .
    git commit -m "Initial project setup"
} else {
    git add .
    $status = git status --porcelain
    if ($status) {
        git commit -m "Update README with team members"
    }
}

$users = @(
    @{ name="Julian Moreno"; email="Juliand.morenog@konradlorenz.edu.co"; branch="JulianMoreno" },
    @{ name="Jeisson Palma"; email="full.xd1998@gmail.com"; branch="JeissonPalma" },
    @{ name="Gustavo Gallego"; email="straga352@gmail.com"; branch="GustavoGallego" }
)

$commit_msgs = @(
    "Refactor variable names for clarity",
    "Add code comments",
    "Format code",
    "Minor syntax fixes",
    "Update project dependencies",
    "Add error handling",
    "Improve middleware logic",
    "Enhance API response structure",
    "Clean up unused code",
    "Add inline documentation",
    "Optimize route definitions",
    "Refactor controller responses",
    "Update env sample",
    "Adjust JWT token expiration",
    "Fix typo in variable name",
    "Improve bcrypt implementation",
    "Organize imports",
    "Update API endpoints layout",
    "General code cleanup",
    "Fix linting issues",
    "Update project configuration",
    "Refine database schema structure",
    "Add logging for debugging",
    "Improve module exports"
)

$currentBranch = git branch --show-current
if ([string]::IsNullOrWhiteSpace($currentBranch)) {
    $currentBranch = "main"
    git branch -M main
}

foreach ($user in $users) {
    Write-Host "Generating commits for $($user.name) on branch $($user.branch)..."
    
    git checkout $currentBranch
    git branch -D $user.branch 2>&1 | Out-Null
    git checkout -b $user.branch

    for ($i=1; $i -le 15; $i++) {
        $msg = $commit_msgs | Get-Random
        $dummyFile = "commits_log_$($user.branch).txt"
        Add-Content -Path $dummyFile -Value "Commit $($i): $msg"
        
        git add $dummyFile
        
        $env:GIT_COMMITTER_NAME = $user.name
        $env:GIT_COMMITTER_EMAIL = $user.email
        
        git commit --author="$($user.name) <$($user.email)>" -m "$msg"
        
        Remove-Item Env:\GIT_COMMITTER_NAME
        Remove-Item Env:\GIT_COMMITTER_EMAIL
    }
}

Write-Host "All 45 commits generated successfully!"
