$env:MongoDB_DATA_VOLUME = "C:\Users\Public\Documents\NSMusicS-GO\MongoDB"
$env:SQLITE_DATA_VOLUME = "C:\Users\Public\Documents\NSMusicS-GO\Sqlite"
$env:METADATA_DATA_VOLUME = "C:\Users\Public\Documents\NSMusicS-GO\MetaData"
$env:MUSIC_DATA_VOLUME = "E:\0_Music"

$dataDirs = @($env:MongoDB_DATA_VOLUME, $env:SQLITE_DATA_VOLUME, $env:METADATA_DATA_VOLUME, $env:MUSIC_DATA_VOLUME)
foreach ($dir in $dataDirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir
    }
}

docker-compose -f docker-compose-local-init.yaml up -d