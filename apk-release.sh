#!/bin/sh

# ---------------------------------------------------------------------------
# modify these config for the target project
ServerAddress=root@122.226.4.214
DeployDirectoryPath=/home/application/front/coh/app/apk
# ---------------------------------------------------------------------------

# ---------------------------------------------------------------------------
cd ./apk
ssh ${ServerAddress} "mkdir -p $DeployDirectoryPath"
scp -r ./* ${ServerAddress}:${DeployDirectoryPath}
## ---------------------------------------------------------------------------
