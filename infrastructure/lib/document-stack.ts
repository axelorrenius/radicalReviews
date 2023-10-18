import { Construct, Stack, StackProps } from "@aws-cdk/core";

export class ECSStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
      super(scope, id, props);

      //S3 bucket for uploading documents
      //Lambda for uploading documents to S3 bucket
      //Lambda that is triggered by bucket and uses AI service to interpret document and paste it into DynamoDB
    }
}