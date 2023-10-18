import { Construct, Stack, StackProps } from '@aws-cdk/core';

import * as ecs from "@aws-cdk/aws-ecs"
import * as ec2 from "@aws-cdk/aws-ec2"
import * as elbv2 from "@aws-cdk/aws-elasticloadbalancingv2"
import * as ecr from "@aws-cdk/aws-ecr"
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class ECSStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2 });
    const cluster = new ecs.Cluster(this, 'Cluster', { vpc: vpc, clusterName: 'Services' });
    const alb = new elbv2.ApplicationLoadBalancer(this, 'ALB', {
      vpc: vpc,
      internetFacing: true,
      loadBalancerName: 'ServicesLB'
    });

    const repo = ecr.Repository.fromRepositoryArn(this, 'RadicalReviews', `arn:aws:ecr:us-east-1:${props?.env?.account}:repository/services`);
    const image = ecs.ContainerImage.fromEcrRepository(repo, 'latest');

    const taskDef = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      memoryLimitMiB: 512,
      cpu: 256,
    })

    const container = taskDef.addContainer('Container', {
      image: image,
      memoryLimitMiB: 512,
    })
    container.addPortMappings({
      containerPort: 8080,
      protocol: ecs.Protocol.TCP
    })

    const service = new ecs.FargateService(this, 'Service', {
      cluster: cluster,
      taskDefinition: taskDef,
      serviceName: 'RadicalReviewsService',
    })

    const listener = alb.addListener('Listener', {
      port: 80,
      open: true
    })

    listener.addTargets('Target', {
      port: 80,
      targets: [service]
    })


  }
}
