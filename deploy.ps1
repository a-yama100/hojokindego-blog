param(
    [Parameter(Mandatory=$true)][string]$Slug,
    [Parameter(Mandatory=$true)][string]$Date,
    [string]$CommitMessage = "",
    [switch]$SkipGitPush
)
$params = @{
    Slug = $Slug
    Date = $Date
    CommitMessage = $CommitMessage
    CallerDir = $PSScriptRoot
}
if ($SkipGitPush) { $params["SkipGitPush"] = $true }
& "D:\サイト管理\共通スクリプト\deploy.ps1" @params
