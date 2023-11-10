# golld

This is the product we created during the course DH2465 during autumn 2023. The repository consists of three parts:

1. Client: the React app which is the user interface of the app
2. Server: the Node.js server which the client uses to create and retrieve data.
3. Infrastructure: infrastructure as code for deploying the application to the AWS cloud.

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
