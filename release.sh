#!/bin/sh

# ---------------------------------------------------------------------------
# modify these config for the target project
ServerAddress=root@8.140.30.11
# ServerAddress=root@101.34.8.71
DeployDirectoryPath=/ctms/apache-tomcat-8.5.83/webapps/h5-page
# ---------------------------------------------------------------------------


# ---------------------------------------------------------------------------
# https://blog.csdn.net/huang0700340204/article/details/113841225
# source ~/.nvm/nvm.sh
# nvm use 18.15.0
npm install
npm run build:prod

cd ./dist
zip -r ./dist.zip ./*

ssh ${ServerAddress} "mkdir -p $DeployDirectoryPath"
scp -r ./dist.zip ${ServerAddress}:${DeployDirectoryPath}
rm ./dist.zip
ssh ${ServerAddress} "cd $DeployDirectoryPath && unzip -o dist.zip"
## ---------------------------------------------------------------------------
