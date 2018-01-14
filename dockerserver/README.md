## Build the docker image
sudo docker build -t nudity_checker .
## Run the docker container in the background
sudo docker run --volume=$(pwd):/workspace -d -p 8080:9999 nudity_checker

## Check logs 
sudo docker logs <CONTAINERNAME>
