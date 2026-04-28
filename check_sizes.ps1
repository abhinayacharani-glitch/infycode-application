Add-Type -AssemblyName System.Drawing
$img1 = [System.Drawing.Image]::FromFile("C:\infycode-application\src\assets\infycode-final-logo4-1.png")
Write-Output "logo4-1:"
$img1.Size
$img1.Dispose()

$img2 = [System.Drawing.Image]::FromFile("C:\infycode-application\src\assets\infycode-final-logo4-2.png")
Write-Output "logo4-2:"
$img2.Size
$img2.Dispose()

$img3 = [System.Drawing.Image]::FromFile("C:\infycode-application\src\assets\infycode-final-logo3.png")
Write-Output "logo3:"
$img3.Size
$img3.Dispose()
