const ec2 = require('@aws-cdk/aws-ec2')
const ecs = require('@aws-cdk/aws-ecs')
const ecsPatterns = require('@aws-cdk/aws-ecs-patterns')
const cdk = require('@aws-cdk/core')
const path = require('path')
const { copyApp } = require('./copy')

const synth = function(name = 'node-starter-app') {
  const app = new cdk.App()
  const stack = new cdk.Stack(app, `${name}FargateServiceStack`)

  const vpc = new ec2.Vpc(stack, name, { maxAzs: 1 })
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc })

  //https://github.com/kneekey23/CDKNodeAppDemo/blob/master/cdk/cdk_stack.py

  new ecsPatterns.NetworkLoadBalancedFargateService(
    stack,
    `${name}FargateService`,
    {
      cluster,
      image: ecs.ContainerImage.fromAsset(
        path.resolve(__dirname, 'local-image'),
      ),
      containerPort: 3000,
      assignPublicIp: true,
    },
  )

  app.synth()
}

copyApp(() => {
  console.log("App copied we're ready")
  synth()
})
