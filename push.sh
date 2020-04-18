#!/usr/bin/env sh

FOLDER="TargetProjectFolderName"

echo 拉去最新代码...
cd ../$FOLDER
git pull

echo 删除旧仓库资源...
cd ../caiwu
rm -rf ../$FOLDER/public/static

echo 复制模板到后端仓库地址...
cp -r ./static/. ../$FOLDER/public/static

echo 复制模板到后端仓库地址...
\cp ./static/index.html ../$FOLDER/resources/views/welcome.blade.php

echo 准备上传...
cd ../$FOLDER
git pull
git add .
git commit -m "build"
git push

echo 提交成功
