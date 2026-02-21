param(
    [Parameter(Mandatory=$true)][string]$Slug,
    [Parameter(Mandatory=$true)][string]$Date,
    [string]$CommitMessage = ""
)
& "D:\サイト管理\共通スクリプト\deploy.ps1" -Slug $Slug -Date $Date -CommitMessage $CommitMessage -CallerDir $PSScriptRoot
