# golld

## Start dev

Run the following in root directory
```
npm run dev
```

The current setup reloads frontend respectively backend on file changes.

## Deploy

docker build -t radicalreviews --platform linux/amd64 .

docker tag radicalreviews:latest 057580831869.dkr.ecr.eu-west-1.amazonaws.com/cdk-hnb659fds-container-assets-057580831869-eu-west-1:latest

docker push 057580831869.dkr.ecr.eu-west-1.amazonaws.com/cdk-hnb659fds-container-assets-057580831869-eu-west-1:latest