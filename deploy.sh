#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e
FILE="./static.tgz"
DEPLOY_SERVER_DEV="root@<%=test_ip%>"
REMOTE_PATH="/data/www/lighttpd/<%=admin_name%>/public"

echo 开始打包...
npm run build

echo 打包结束，开始压缩...
tar -zcvf $FILE ./static

echo 准备上传...
scp static.tgz $DEPLOY_SERVER_DEV:$REMOTE_PATH

echo 上传完毕，准备执行远程操作...
ssh -tt $DEPLOY_SERVER_DEV << remotessh
cd $REMOTE_PATH
# 清除旧资源
rm -rf ./static
tar -zxvf ./static.tgz
\cp ./static/index.html ../resources/views/welcome.blade.php
exit
remotessh

echo 删除本地压缩包
rm -rf ./static.tgz


echo 结束
