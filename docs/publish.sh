echo 拷贝_site下的文件到根目录

cp -a _site/. ./

git add .

echo -n "请输入 commit message  -> "
read msg
git commit -m "$msg"

git pull

git push