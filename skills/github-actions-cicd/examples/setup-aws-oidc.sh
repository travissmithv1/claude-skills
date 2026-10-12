#!/bin/bash
set -e

echo "AWS OIDC Setup for GitHub Actions and Terraform Cloud"
echo "======================================================"
echo ""

if ! command -v aws &> /dev/null; then
    echo "Error: AWS CLI is not installed."
    exit 1
fi

echo "Verifying AWS authentication..."
aws sts get-caller-identity > /dev/null
echo "Authenticated successfully."
echo ""

read -p "Enter AWS Account ID: " ACCOUNT_ID
read -p "Enter GitHub repository (owner/repo): " GITHUB_REPO
read -p "Enter Terraform Cloud organization name: " TFC_ORG
read -p "Enter project/application name prefix: " APP_PREFIX

# =============================================================================
# GitHub Actions OIDC
# =============================================================================

GITHUB_OIDC_PROVIDER="token.actions.githubusercontent.com"
GITHUB_PROVIDER_ARN="arn:aws:iam::${ACCOUNT_ID}:oidc-provider/${GITHUB_OIDC_PROVIDER}"
GITHUB_ROLE_NAME="GitHubActionsRole"

echo ""
echo "Setting up GitHub Actions OIDC..."
echo "---------------------------------"

if ! aws iam get-open-id-connect-provider --open-id-connect-provider-arn "$GITHUB_PROVIDER_ARN" &> /dev/null; then
    echo "Creating OIDC provider for GitHub Actions..."
    aws iam create-open-id-connect-provider \
        --url "https://${GITHUB_OIDC_PROVIDER}" \
        --client-id-list "sts.amazonaws.com" \
        --thumbprint-list "6938fd4d98bab03faadb97b34396831e3780aea1" \
        --tags Key=Purpose,Value=GitHubActions
    echo "GitHub OIDC provider created."
else
    echo "GitHub OIDC provider already exists."
fi

GITHUB_TRUST_POLICY=$(cat <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "${GITHUB_PROVIDER_ARN}"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "${GITHUB_OIDC_PROVIDER}:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "${GITHUB_OIDC_PROVIDER}:sub": "repo:${GITHUB_REPO}:*"
        }
      }
    }
  ]
}
POLICY
)

echo "Creating/updating GitHub Actions IAM role..."

if aws iam get-role --role-name "$GITHUB_ROLE_NAME" &> /dev/null; then
    aws iam update-assume-role-policy \
        --role-name "$GITHUB_ROLE_NAME" \
        --policy-document "$GITHUB_TRUST_POLICY"
    echo "Updated existing role trust policy."
else
    aws iam create-role \
        --role-name "$GITHUB_ROLE_NAME" \
        --assume-role-policy-document "$GITHUB_TRUST_POLICY" \
        --description "Role for GitHub Actions CI/CD via OIDC" \
        --tags Key=Purpose,Value=GitHubActions
    echo "Created new role."
fi

GITHUB_POLICY=$(cat <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ECRAuth",
      "Effect": "Allow",
      "Action": "ecr:GetAuthorizationToken",
      "Resource": "*"
    },
    {
      "Sid": "ECRPush",
      "Effect": "Allow",
      "Action": [
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:PutImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload"
      ],
      "Resource": "arn:aws:ecr:*:${ACCOUNT_ID}:repository/${APP_PREFIX}-*"
    },
    {
      "Sid": "ECS",
      "Effect": "Allow",
      "Action": [
        "ecs:DescribeServices",
        "ecs:DescribeTaskDefinition",
        "ecs:DescribeTasks",
        "ecs:ListTasks",
        "ecs:RegisterTaskDefinition",
        "ecs:UpdateService"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ECSPassRole",
      "Effect": "Allow",
      "Action": "iam:PassRole",
      "Resource": [
        "arn:aws:iam::${ACCOUNT_ID}:role/${APP_PREFIX}-*-ecs-task-execution",
        "arn:aws:iam::${ACCOUNT_ID}:role/${APP_PREFIX}-*-ecs-task"
      ]
    },
    {
      "Sid": "S3",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::${APP_PREFIX}-*-web-${ACCOUNT_ID}",
        "arn:aws:s3:::${APP_PREFIX}-*-web-${ACCOUNT_ID}/*"
      ]
    },
    {
      "Sid": "CloudFront",
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation",
        "cloudfront:GetInvalidation"
      ],
      "Resource": "arn:aws:cloudfront::${ACCOUNT_ID}:distribution/*"
    }
  ]
}
POLICY
)

aws iam put-role-policy \
    --role-name "$GITHUB_ROLE_NAME" \
    --policy-name "GitHubActionsPolicy" \
    --policy-document "$GITHUB_POLICY"

GITHUB_ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${GITHUB_ROLE_NAME}"
echo "GitHub Actions role configured: ${GITHUB_ROLE_ARN}"
echo ""

# =============================================================================
# Terraform Cloud OIDC
# =============================================================================

TFC_OIDC_PROVIDER="app.terraform.io"
TFC_PROVIDER_ARN="arn:aws:iam::${ACCOUNT_ID}:oidc-provider/${TFC_OIDC_PROVIDER}"
TFC_ROLE_NAME="TerraformCloudRole"

echo "Setting up Terraform Cloud OIDC..."
echo "-----------------------------------"

if ! aws iam get-open-id-connect-provider --open-id-connect-provider-arn "$TFC_PROVIDER_ARN" &> /dev/null; then
    echo "Creating OIDC provider for Terraform Cloud..."

    TFC_THUMBPRINT=$(echo | openssl s_client -servername app.terraform.io -connect app.terraform.io:443 2>/dev/null | openssl x509 -fingerprint -sha1 -noout | sed 's/.*=//;s/://g' | tr '[:upper:]' '[:lower:]')

    if [ -z "$TFC_THUMBPRINT" ]; then
        TFC_THUMBPRINT="9e99a48a9960b14926bb7f3b02e22da2b0ab7280"
    fi

    aws iam create-open-id-connect-provider \
        --url "https://${TFC_OIDC_PROVIDER}" \
        --client-id-list "aws.workload.identity" \
        --thumbprint-list "$TFC_THUMBPRINT" \
        --tags Key=Purpose,Value=TerraformCloud
    echo "Terraform Cloud OIDC provider created."
else
    echo "Terraform Cloud OIDC provider already exists."
fi

TFC_TRUST_POLICY=$(cat <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "${TFC_PROVIDER_ARN}"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "${TFC_OIDC_PROVIDER}:aud": "aws.workload.identity"
        },
        "StringLike": {
          "${TFC_OIDC_PROVIDER}:sub": "organization:${TFC_ORG}:project:*:workspace:*:run_phase:*"
        }
      }
    }
  ]
}
POLICY
)

echo "Creating/updating Terraform Cloud IAM role with admin access..."

if aws iam get-role --role-name "$TFC_ROLE_NAME" &> /dev/null; then
    aws iam update-assume-role-policy \
        --role-name "$TFC_ROLE_NAME" \
        --policy-document "$TFC_TRUST_POLICY"
    echo "Updated existing role trust policy."
else
    aws iam create-role \
        --role-name "$TFC_ROLE_NAME" \
        --assume-role-policy-document "$TFC_TRUST_POLICY" \
        --description "Role for Terraform Cloud with admin access via OIDC" \
        --tags Key=Purpose,Value=TerraformCloud
    echo "Created new role."
fi

if ! aws iam list-attached-role-policies --role-name "$TFC_ROLE_NAME" | grep -q "AdministratorAccess"; then
    aws iam attach-role-policy \
        --role-name "$TFC_ROLE_NAME" \
        --policy-arn "arn:aws:iam::aws:policy/AdministratorAccess"
    echo "Attached AdministratorAccess policy."
else
    echo "AdministratorAccess policy already attached."
fi

TFC_ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${TFC_ROLE_NAME}"
echo "Terraform Cloud role configured: ${TFC_ROLE_ARN}"
echo ""

# =============================================================================
# Summary
# =============================================================================

echo "======================================================"
echo "OIDC Setup Complete!"
echo "======================================================"
echo ""
echo "GitHub Actions:"
echo "  OIDC Provider: ${GITHUB_PROVIDER_ARN}"
echo "  Role ARN:      ${GITHUB_ROLE_ARN}"
echo ""
echo "Terraform Cloud:"
echo "  OIDC Provider: ${TFC_PROVIDER_ARN}"
echo "  Role ARN:      ${TFC_ROLE_ARN}"
echo ""
echo "Next steps:"
echo ""
echo "1. Configure Terraform Cloud workspace variables:"
echo "   TFC_AWS_PROVIDER_AUTH = true"
echo "   TFC_AWS_RUN_ROLE_ARN  = ${TFC_ROLE_ARN}"
echo ""
echo "2. Configure GitHub repository secret:"
echo "   AWS_ROLE_ARN = ${GITHUB_ROLE_ARN}"
echo ""
echo "Or run the setup scripts:"
echo "   ./scripts/setup-terraform-workspace.sh"
echo "   ./scripts/setup-github-environment.sh"
