[CmdletBinding()]
param(
    [int[]]$Ports = @(5173, 5050)
)

$ErrorActionPreference = "Stop"

try {
    $uniquePorts = $Ports | Sort-Object -Unique
    Write-Host "Clearing PA3 platform ports: $($uniquePorts -join ', ')..."
    Write-Host ""

    $listeners = foreach ($port in $uniquePorts) {
        Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue |
            ForEach-Object {
                $process = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
                [pscustomobject]@{
                    Port = $port
                    PID = $_.OwningProcess
                    Process = if ($process) { $process.ProcessName } else { "(unknown)" }
                }
            }
    }

    if (-not $listeners) {
        Write-Host "No listeners found on PA3 platform ports."
        exit 0
    }

    $listeners |
        Sort-Object Port, PID -Unique |
        Format-Table -AutoSize

    $processIds = $listeners | Select-Object -ExpandProperty PID -Unique

    foreach ($processId in $processIds) {
        Stop-Process -Id $processId -Force -ErrorAction Stop
        Write-Host "Stopped PID $processId."
    }

    exit 0
} catch {
    Write-Error $_.Exception.Message
    exit 1
}
