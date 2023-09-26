echo "BRANCH_NAME" $INPUT_BRANCH_NAME
echo "SERVER_NAME" $INPUT_SERVER_NAME
echo "APP_UNDER_MAINTAINANCE" $INPUT_APP_UNDER_MAINTAINANCE

cd ~/projects/book-review-graphql-BE/

git checkout $INPUT_BRANCH_NAME
git reset --hard HEAD
git pull origin $INPUT_BRANCH_NAME

if [[ $INPUT_BRANCH_NAME != *"master"* ]];
then
	exit 1
else
	exit 0
fi