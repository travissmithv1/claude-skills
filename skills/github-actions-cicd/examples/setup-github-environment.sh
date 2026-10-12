#!/bin/bash
set -e

echo "GitHub Environment Setup Script"
echo "================================"
echo ""
echo "This script configures GitHub repository secrets and environment variables"
echo "using values from Terraform outputs."
echo ""
echo "Prerequisites:"
echo "  - GitHub CLI installed and authenticated (gh auth login)"
echo "  - Terraform applied successfully in the target environment"
echo ""

if ! command -v gh &> /dev/null; then
    echo "Error: GitHub CLI (gh) is not installed."
    echo "Install it from: https://cli.github.com/"
    exit 1
fi

if ! gh auth status &> /dev/null; then
    echo "Error: Not authenticated with GitHub CLI."
    echo "Run: gh auth login"
    exit 1
fi

read -p "Enter project/application name prefix: " APP_PREFIX
read -p "Enter environment name (e.g., qa): " ENVIRONMENT
read -p "Enter AWS Role ARN for GitHub OIDC: " AWS_ROLE_ARN
read -p "Enter AWS Region: " AWS_REGION
read -p "Enter ECR Repository URL: " ECR_REPOSITORY_URL
read -p "Enter ECS Cluster Name: " ECS_CLUSTER_NAME
read -p "Enter ECS Service Name: " ECS_SERVICE_NAME
read -p "Enter Task Execution Role ARN: " TASK_EXECUTION_ROLE_ARN
read -p "Enter Task Role ARN: " TASK_ROLE_ARN
read -p "Enter Log Group Name: " LOG_GROUP_NAME
read -p "Enter S3 Bucket Name: " S3_BUCKET_NAME
read -p "Enter CloudFront Distribution ID: " CLOUDFRONT_DISTRIBUTION_ID
read -p "Enter CloudFront Domain Name: " CLOUDFRONT_DOMAIN_NAME
read -p "Enter Database Host: " DB_HOST
read -p "Enter JWT Secret ARN: " JWT_SECRET_ARN
read -p "Enter DB Password Secret ARN: " DB_PASSWORD_SECRET_ARN

REPO=$(gh repo view --json nameWithOwner -q '.nameWithOwner')
echo ""
echo "Repository: $REPO"
echo "Environment: $ENVIRONMENT"
echo ""

echo "Creating/updating repository secret AWS_ROLE_ARN..."
gh secret set AWS_ROLE_ARN --body "$AWS_ROLE_ARN"

echo "Creating environment '$ENVIRONMENT' if it doesn't exist..."
gh api repos/$REPO/environments/$ENVIRONMENT -X PUT -f wait_timer=0 || true

echo "Setting environment variables for '$ENVIRONMENT'..."

gh variable set AWS_REGION --env $ENVIRONMENT --body "$AWS_REGION"
gh variable set ECR_REPOSITORY_URL --env $ENVIRONMENT --body "$ECR_REPOSITORY_URL"
gh variable set ECS_CLUSTER_NAME --env $ENVIRONMENT --body "$ECS_CLUSTER_NAME"
gh variable set ECS_SERVICE_NAME --env $ENVIRONMENT --body "$ECS_SERVICE_NAME"
gh variable set TASK_EXECUTION_ROLE_ARN --env $ENVIRONMENT --body "$TASK_EXECUTION_ROLE_ARN"
gh variable set TASK_ROLE_ARN --env $ENVIRONMENT --body "$TASK_ROLE_ARN"
gh variable set LOG_GROUP_NAME --env $ENVIRONMENT --body "$LOG_GROUP_NAME"
gh variable set S3_BUCKET_NAME --env $ENVIRONMENT --body "$S3_BUCKET_NAME"
gh variable set CLOUDFRONT_DISTRIBUTION_ID --env $ENVIRONMENT --body "$CLOUDFRONT_DISTRIBUTION_ID"
gh variable set CORS_ORIGIN --env $ENVIRONMENT --body "https://$CLOUDFRONT_DOMAIN_NAME"
gh variable set API_URL --env $ENVIRONMENT --body "https://$CLOUDFRONT_DOMAIN_NAME/api"
gh variable set DB_HOST --env $ENVIRONMENT --body "$DB_HOST"
gh variable set JWT_SECRET_ARN --env $ENVIRONMENT --body "$JWT_SECRET_ARN"
gh variable set DB_PASSWORD_SECRET_ARN --env $ENVIRONMENT --body "$DB_PASSWORD_SECRET_ARN"
gh variable set TASK_FAMILY --env $ENVIRONMENT --body "${APP_PREFIX}-${ENVIRONMENT}-api"

echo ""
echo "Setup complete!"
echo ""
echo "Environment variables configured for '$ENVIRONMENT':"
echo "  - AWS_REGION"
echo "  - ECR_REPOSITORY_URL"
echo "  - ECS_CLUSTER_NAME"
echo "  - ECS_SERVICE_NAME"
echo "  - TASK_EXECUTION_ROLE_ARN"
echo "  - TASK_ROLE_ARN"
echo "  - LOG_GROUP_NAME"
echo "  - S3_BUCKET_NAME"
echo "  - CLOUDFRONT_DISTRIBUTION_ID"
echo "  - CORS_ORIGIN"
echo "  - API_URL"
echo "  - DB_HOST"
echo "  - JWT_SECRET_ARN"
echo "  - DB_PASSWORD_SECRET_ARN"
echo "  - TASK_FAMILY"
echo ""
echo "Repository secrets configured:"
echo "  - AWS_ROLE_ARN"
