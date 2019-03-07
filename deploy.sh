#!/bin/bash
#1.change value of subDomain in configs/localconfig.js
#2.change value of homepage host in package.json
#3.remove redux logger in redux/store/index.js
#4.delete default account and password in Login component
#5.run this shell
#6.upload web.zip to server

sshaccount='mituresdev@106.15.202.29'

npm run --prefix ~/+work/newMituresWorkspace/mitures-web/web/ build
mv ~/+work/newMituresWorkspace/mitures-web/web/build ~/cache/
cd ~/cache
rm -rf ./web
mv ./build ./web
rm ~/cache/web/static/*/*.map
rm -rf ~/cache/web/easemob/
cd ~/cache
zip -r ~/cache/web.zip web/ -P 'q11111111v'
#rm -rf ~/cache/web
#shell below is for dev
ssh $sshaccount rm -rf /home/mituresdev/web/static/
rsync -ar ./web/* ${sshaccount}:~/web
