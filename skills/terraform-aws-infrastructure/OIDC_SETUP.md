# Manual OIDC Setup Instructions

## Terraform Cloud OIDC Provider in AWS

1. Create OIDC Identity Provider in AWS IAM:
   - Provider URL: https://app.terraform.io
   - Audience: aws.workload.identity

2. Create IAM Role for Terraform Cloud:
   - Trusted entity: Web identity
   - Identity provider: app.terraform.io
   - Audience: aws.workload.identity
   - Condition: sub contains organization:YOUR_ORG:project:YOUR_PROJECT:workspace:YOUR_WORKSPACE

3. Attach policies to role:
   - Custom policy with required AWS permissions
   - Or managed policies as needed

## GitHub OIDC Provider in AWS

1. Create OIDC Identity Provider in AWS IAM:
   - Provider URL: https://token.actions.githubusercontent.com
   - Audience: sts.amazonaws.com

2. Create IAM Role for GitHub Actions:
   - Trusted entity: Web identity
   - Identity provider: token.actions.githubusercontent.com
   - Audience: sts.amazonaws.com
   - Condition: sub contains repo:YOUR_ORG/YOUR_REPO

3. Attach policies to role:
   - ECR push/pull
   - ECS deploy
   - Secrets Manager read
