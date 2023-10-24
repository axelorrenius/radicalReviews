import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs"
import * as rds from "aws-cdk-lib/aws-rds"
import * as ec2 from "aws-cdk-lib/aws-ec2"
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class ECSStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2 });


    const dbSG = new ec2.SecurityGroup(this, 'DBSG', {
      vpc: vpc,
      securityGroupName: 'DBSG',
      allowAllOutbound: true,
    })

    dbSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(5432), 'Allow inbound to DB')

    const db = new rds.DatabaseInstance(this, "RadicalReviewsDB", {
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_15_4 }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T4G, ec2.InstanceSize.MICRO),
      vpc: vpc,
      securityGroups: [dbSG],
      allocatedStorage: 10,
      deletionProtection: false,
      databaseName: 'radicalreviews',
      multiAz: false,
      credentials: rds.Credentials.fromGeneratedSecret('myname')
    })


    // const cluster = new ecs.Cluster(this, 'Cluster', { vpc: vpc, clusterName: 'Services' });
    // const alb = new elbv2.ApplicationLoadBalancer(this, 'ALB', {
    //   vpc: vpc,
    //   internetFacing: true,
    //   loadBalancerName: 'ServicesLB'
    // });

    // const repo = ecr.Repository.fromRepositoryArn(this, 'RadicalReviews', `arn:aws:ecr:us-east-1:${props?.env?.account}:repository/services`);
    // const image = ecs.ContainerImage.fromEcrRepository(repo, 'latest');

    // const taskDef = new ecs.FargateTaskDefinition(this, 'TaskWDef', {
    //   memoryLimitMiB: 512,
    //   cpu: 256,
    // })

    // const container = taskDef.addContainer('Container', {
    //   image: image,
    //   memoryLimitMiB: 512,
    // })
    // container.addPortMappings({
    //   containerPort: 8080,
    //   protocol: ecs.Protocol.TCP
    // })

    // const service = new ecs.FargateService(this, 'Service', {
    //   cluster: cluster,
    //   taskDefinition: taskDef,
    //   serviceName: 'RadicalReviewsService',
    // })

    // const listener = alb.addListener('Listener', {
    //   port: 80,
    //   open: true
    // })

    // listener.addTargets('Target', {
    //   port: 80,
    //   targets: [service]
    // })


  }
}
