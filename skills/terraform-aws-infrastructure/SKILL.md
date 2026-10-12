---
name: terraform-aws-infrastructure
description: AWS infrastructure setup using Terraform with modular design. Use when creating infrastructure, setting up AWS resources, configuring environments, or working with Terraform modules.
---

# Terraform AWS Infrastructure

## Structure
```
infrastructure/
├── modules/
│   └── (project-specific modules)
└── environments/
    ├── qa/
    └── production/
```

## Module Design
- Each module is self-contained with main.tf, variables.tf, outputs.tf
- No terraform.tfvars files — variables configured through Terraform Cloud UI
- Modules expose outputs for cross-module dependencies

## AWS Authentication
- Terraform Cloud connects to AWS via OIDC
- No long-lived credentials stored
- IAM role with trust policy for Terraform Cloud

## Setup Scripts
Create shell scripts in `scripts/` directory:
- `setup-aws-oidc.sh` — Creates OIDC providers and IAM roles
- `setup-terraform-workspace.sh` — Creates Terraform Cloud workspace and sets variables

See [examples/setup-aws-oidc.sh](examples/setup-aws-oidc.sh) and [examples/setup-terraform-workspace.sh](examples/setup-terraform-workspace.sh) for reference implementations.

## Script Configuration Values
Always prompt the user for these values — never use hardcoded values from examples:
- AWS Account ID
- Terraform Cloud organization name
- Project/application name prefix
- AWS region
- GitHub repository (owner/repo format)

## Terraform Workspace Setup Script
- Uses Terraform Cloud API to create workspace
- Reads API token from ~/.terraform.d/credentials.tfrc.json (created by `terraform login`)
- Do NOT require users to export TF_API_TOKEN or TF_TOKEN_app_terraform_io
- Only fall back to environment variable if credentials file doesn't exist
- Prompt for any sensitive values the project requires
- Auto-generate secrets if not provided: `openssl rand -base64 32`
- Sets environment variables: TFC_AWS_PROVIDER_AUTH, TFC_AWS_RUN_ROLE_ARN
- Configures working directory for environment

## Terraform Cloud Setup
- Set TFC_AWS_PROVIDER_AUTH = true
- Set TFC_AWS_RUN_ROLE_ARN = arn:aws:iam::ACCOUNT_ID:role/TerraformCloudRole
- Configure as workspace variables via setup script or Terraform Cloud UI

## Variable Strategy
- Start with minimal variables initially
- Only add variables when values differ between environments
- Hardcode sensible defaults in modules where possible
- Add variables incrementally as needs arise

## Environment Configuration
- Start with one environment (e.g., QA), add others later
- One Terraform Cloud workspace per environment
- No shared workspaces
- Environment-specific variables in Terraform Cloud UI

## Common Modules (include as needed)
- VPC with public/private subnets
- ECS Fargate (container workloads)
- Lambda (serverless)
- RDS (relational database)
- DynamoDB (NoSQL)
- S3 (object storage)
- CloudFront (CDN)
- Secrets Manager
- Bastion host (private resource access)
- Billing alarm (cost monitoring)
- Monitoring and alerting

## RDS Configuration (if using RDS)
CRITICAL: Before specifying a Postgres version, you MUST run this command and use a version from the output:
```bash
aws rds describe-db-engine-versions --engine postgres --query "DBEngineVersions[?Status=='available'].EngineVersion" --output text
```
- NEVER assume a Postgres version is available — always verify first
- Use the latest available major version from the command output
- Common pitfall: versions like 15.0, 14.0 don't exist — AWS uses 15.4, 14.9, etc.
- Non-prod: writer only; Prod: writer + read replica (if needed)

## ECR Configuration (if using ECR)
- ECR repository can be environment-independent or per-environment
- If shared: define in first environment, reference via data source in others
- Do not create separate shared Terraform Cloud workspace for ECR

## CloudFront Configuration (if using CloudFront)
- Use default CloudFront domain initially (*.cloudfront.net)
- Add custom domain, ACM certificate, Route53 later if needed
- Configure origins and cache behaviors based on project needs

## Secrets Management (if using Secrets Manager)
- Define secrets as sensitive Terraform variables
- Set values in Terraform Cloud workspace as sensitive
- Generate secrets locally: `openssl rand -base64 32`

## Monitoring and Alerting
Create a monitoring module with:

### SNS Topic
- Create SNS topic for alert notifications
- Subscribe email addresses for alert recipients
- Prompt user for alert email address during setup

### CloudWatch Alarms (include as needed)
- ECS CPU utilization (threshold: 80%)
- ECS memory utilization (threshold: 80%)
- RDS CPU utilization (threshold: 80%)
- RDS free storage space (threshold: 10% of allocated)
- RDS database connections (threshold: 80% of max)
- ALB target response time (threshold: based on SLA)
- ALB 5xx error rate (threshold: 1%)
- ALB unhealthy host count (threshold: 1)
- Lambda errors (threshold: based on expected error rate)
- Lambda duration (threshold: approaching timeout)

### CloudWatch Dashboard (if needed)
- Create dashboard with key metrics
- Include widgets for ECS, RDS, ALB, Lambda as applicable
- Organize by service or application component

### Log-Based Alerts (if needed)
- Create metric filters for ERROR log patterns
- Alert on application-specific error conditions
- Monitor for security-related events

### Alarm Actions
- All alarms send to SNS topic
- Consider separate topics for different severity levels
- OK actions to notify when issues resolve

## IAM Policies
- Scope permissions appropriately for each role
- Use wildcards judiciously for related resources

## Security
- Database not publicly accessible
- Encryption at rest enabled
- Secrets with auto-rotation where supported
- Bastion host for private resource access (if needed)

## Constraints
- No connection between Terraform and GitHub
- Terraform variables only configure AWS resources