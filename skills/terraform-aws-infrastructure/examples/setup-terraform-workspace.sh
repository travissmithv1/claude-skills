#!/bin/bash
set -e

echo "Terraform Cloud Workspace Setup"
echo "================================"
echo ""

if ! command -v terraform &> /dev/null; then
    echo "Error: Terraform CLI is not installed."
    exit 1
fi

if [ -z "$TF_TOKEN_app_terraform_io" ] && [ ! -f ~/.terraform.d/credentials.tfrc.json ]; then
    echo "Error: Not authenticated with Terraform Cloud."
    echo "Run: terraform login"
    exit 1
fi

read -p "Enter AWS Account ID: " ACCOUNT_ID
read -p "Enter Terraform Cloud organization name: " TFC_ORG
read -p "Enter project/application name prefix: " APP_PREFIX
read -p "Enter environment name (e.g., qa): " ENVIRONMENT
read -p "Enter AWS region: " AWS_REGION

WORKSPACE_NAME="${APP_PREFIX}-${ENVIRONMENT}"
DEFAULT_TFC_ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/TerraformCloudRole"

read -p "Enter Terraform Cloud OIDC Role ARN [${DEFAULT_TFC_ROLE_ARN}]: " TFC_ROLE_ARN
TFC_ROLE_ARN="${TFC_ROLE_ARN:-$DEFAULT_TFC_ROLE_ARN}"

read -s -p "Enter JWT secret (or press enter to generate): " JWT_SECRET
echo ""
if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -base64 32)
    echo "Generated JWT secret."
fi

read -s -p "Enter DB password (or press enter to generate): " DB_PASSWORD
echo ""
if [ -z "$DB_PASSWORD" ]; then
    DB_PASSWORD=$(openssl rand -base64 32)
    echo "Generated DB password."
fi

read -p "Enter billing alert email (optional): " BILLING_EMAIL

echo ""
echo "Creating workspace ${WORKSPACE_NAME}..."

WORKSPACE_PAYLOAD=$(cat <<PAYLOAD
{
  "data": {
    "type": "workspaces",
    "attributes": {
      "name": "${WORKSPACE_NAME}",
      "execution-mode": "remote",
      "auto-apply": false,
      "terraform-version": "~> 1.0",
      "working-directory": "infrastructure/environments/${ENVIRONMENT}"
    }
  }
}
PAYLOAD
)

API_TOKEN=$(cat ~/.terraform.d/credentials.tfrc.json 2>/dev/null | grep -o '"token": "[^"]*"' | head -1 | cut -d'"' -f4)
if [ -z "$API_TOKEN" ]; then
    API_TOKEN="$TF_TOKEN_app_terraform_io"
fi

WORKSPACE_RESPONSE=$(curl -s \
    --header "Authorization: Bearer ${API_TOKEN}" \
    --header "Content-Type: application/vnd.api+json" \
    --request POST \
    --data "${WORKSPACE_PAYLOAD}" \
    "https://app.terraform.io/api/v2/organizations/${TFC_ORG}/workspaces" 2>/dev/null)

WORKSPACE_ID=$(echo "$WORKSPACE_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$WORKSPACE_ID" ]; then
    echo "Workspace may already exist, fetching ID..."
    WORKSPACE_RESPONSE=$(curl -s \
        --header "Authorization: Bearer ${API_TOKEN}" \
        --header "Content-Type: application/vnd.api+json" \
        "https://app.terraform.io/api/v2/organizations/${TFC_ORG}/workspaces/${WORKSPACE_NAME}")
    WORKSPACE_ID=$(echo "$WORKSPACE_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
fi

echo "Workspace ID: ${WORKSPACE_ID}"

create_variable() {
    local key=$1
    local value=$2
    local category=$3
    local sensitive=$4
    local hcl=${5:-false}

    local PAYLOAD=$(cat <<VARPAYLOAD
{
  "data": {
    "type": "vars",
    "attributes": {
      "key": "${key}",
      "value": "${value}",
      "category": "${category}",
      "sensitive": ${sensitive},
      "hcl": ${hcl}
    }
  }
}
VARPAYLOAD
)

    curl -s \
        --header "Authorization: Bearer ${API_TOKEN}" \
        --header "Content-Type: application/vnd.api+json" \
        --request POST \
        --data "${PAYLOAD}" \
        "https://app.terraform.io/api/v2/workspaces/${WORKSPACE_ID}/vars" > /dev/null

    echo "  - ${key}"
}

echo ""
echo "Creating environment variables..."
create_variable "TFC_AWS_PROVIDER_AUTH" "true" "env" "false"
create_variable "TFC_AWS_RUN_ROLE_ARN" "${TFC_ROLE_ARN}" "env" "false"

echo ""
echo "Creating Terraform variables..."
create_variable "jwt_secret" "${JWT_SECRET}" "terraform" "true"
create_variable "db_password" "${DB_PASSWORD}" "terraform" "true"

if [ -n "$BILLING_EMAIL" ]; then
    create_variable "billing_alert_email" "${BILLING_EMAIL}" "terraform" "false"
fi

echo ""
echo "Setup complete!"
echo ""
echo "Workspace: https://app.terraform.io/app/${TFC_ORG}/workspaces/${WORKSPACE_NAME}"
echo ""
echo "Next steps:"
echo "  1. cd infrastructure/environments/${ENVIRONMENT}"
echo "  2. terraform init"
echo "  3. terraform plan"
echo "  4. terraform apply"
