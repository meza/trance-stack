import { Duration, RemovalPolicy } from 'aws-cdk-lib';
import { AnyPrincipal, Effect, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Bucket, ObjectOwnership } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, CacheControl, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import type { LambdaDeployment } from './LambdaDeployment';

export interface StaticDeploymentProps {
  publicDir: string;
  keyPrefix?: string;
}

export class StaticDeployment extends Construct {
  private readonly bucketResource: Bucket;
  private readonly key: string;

  constructor(scope: Construct, id: string, props: StaticDeploymentProps) {
    super(scope, id);
    this.key = props.keyPrefix || '_static';

    this.bucketResource = new Bucket(this, 'Bucket', {
      objectOwnership: ObjectOwnership.BUCKET_OWNER_ENFORCED,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: '404.html',
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY
    });

    const bucketPolicy = new PolicyStatement({
      sid: 'AllowPublicRead',
      effect: Effect.ALLOW,
      actions: ['s3:GetObject'],
      resources: [`${this.bucketResource.bucketArn}/*`],
      principals: [new AnyPrincipal()]
    });

    this.bucketResource.addToResourcePolicy(bucketPolicy);

    const role = new Role(this, 'BucketDeploymentRole', {
      description: `Service Role for the Static Asset Deployment for ${scope.node.id}, managed by CDK`,
      assumedBy: new ServicePrincipal('lambda.amazonaws.com')
    });

    const bucketDeployment = new BucketDeployment(this, 'Default', {
      sources: [Source.asset(props.publicDir)],
      destinationBucket: this.bucketResource,
      destinationKeyPrefix: this.key,
      cacheControl: [
        CacheControl.maxAge(Duration.days(365)),
        CacheControl.sMaxAge(Duration.days(365))
      ],
      logRetention: RetentionDays.SIX_MONTHS,
      role: role
    });

    const awscliLayer = bucketDeployment.node.findChild('AwsCliLayer');
    awscliLayer.node.findChild('Resource');
  }

  grantAccessTo(lambda: LambdaDeployment) {
    this.bucketResource.grantReadWrite(lambda.lambda());
    this.bucketResource.grantDelete(lambda.lambda());
    this.bucketResource.grantPut(lambda.lambda());
  }

  bucket() {
    return {
      bucket: this.bucketResource,
      key: this.key
    };
  }
}
