$EnvVarName = "NPM_PUBLISH_TOKEN"
$SecretFile = ".npm-token.secret"

# 1. Check if the secret file exists
if (Test-Path $SecretFile) {
    $Token = Get-Content $SecretFile
    # Use Set-Item for dynamic environment variable naming
    Set-Item -Path "Env:\$EnvVarName" -Value $Token
    Write-Host "✅ $EnvVarName has been set from $SecretFile" -ForegroundColor Green
} else {
    # 2. If not, ask the user for it
    Write-Host "⚠️  $EnvVarName not found." -ForegroundColor Yellow
    $InputToken = Read-Host "Please paste your NPM Granular Token"
    
    if ($InputToken) {
        # Set it for the current session dynamically
        Set-Item -Path "Env:\$EnvVarName" -Value $InputToken
        
        # Save it to the secret file for next time
        $InputToken | Out-File -FilePath $SecretFile -NoNewline
        Write-Host "✅ Token saved to $SecretFile and set for this session." -ForegroundColor Green
        Write-Host "❗ IMPORTANT: Ensure '$SecretFile' is ignored by Git (check your **/secret.* pattern)!" -ForegroundColor Cyan
    }
}



# async function npmPublishCliAsync() {
#     try {
#         // 1. Try to get token from Environment or local Secret file
#         let pat = process.env.NPM_PUBLISH_TOKEN;
#         const secretPath = path.join(process.cwd(), '.npm-token.secret');

#         if (!pat && fs.existsSync(secretPath)) {
#             pat = fs.readFileSync(secretPath, 'utf8').trim();
#             // Optional: Set it to env so sub-processes can see it too
#             process.env.NPM_PUBLISH_TOKEN = pat; 
#         }

#         if (!pat) {
#             console.error(chalk.bgRed.white.bold(" MISSING TOKEN "));
#             console.log(chalk.red("No NPM_PUBLISH_TOKEN found in environment or .npm-token.secret"));
#             console.log(chalk.cyan("Please run: .\\setup-npm-auth.ps1\n"));
#             process.exit(1);
#         }

#         // ... existing logic ...

#         // Pass the 'pat' to your publishToNpmAsync function
#         await publishToNpmAsync(mainLibraryData, confirmBeforePublish, pat);

#     } catch (err) {
#         logErrorToConsole(err);
#         process.exit(1);
#     }
# }