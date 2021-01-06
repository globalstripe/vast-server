export GCLOUD_PROJECT_ID=node-express-2112
export IMAGE_TAG=node-web-app
export PROJECT_NAME=vast-server

echo $IMAGE_TAG
read x

docker build -t $IMAGE_TAG .

docker tag $IMAGE_TAG gcr.io/$GCLOUD_PROJECT_ID/$PROJECT_NAME
docker push gcr.io/$GCLOUD_PROJECT_ID/$PROJECT_NAME

gcloud run deploy --image gcr.io/$GCLOUD_PROJECT_ID/$PROJECT_NAME --platform managed
