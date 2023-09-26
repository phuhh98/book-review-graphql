echo "BRANCH_NAME" $BRANCH_NAME
echo "SERVER_NAME" $SERVER_NAME
echo "APP_UNDER_MAINTAINANCE" $APP_UNDER_MAINTAINANCE

cd ~/book-review-graphql-BE/

git checkout $BRANCH_NAME
git reset --hard HEAD
git pull origin $BRANCH_NAME

if [[ $BRANCH_NAME != *"master"* ]];
then
	exit 1
else
	exit 0
fi