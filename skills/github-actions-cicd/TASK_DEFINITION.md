# ECS Task Definition Template

## Placeholder Format
Use uppercase with _PLACEHOLDER suffix:
- AWS_REGION_PLACEHOLDER
- AWS_ACCOUNT_ID_PLACEHOLDER
- IMAGE_PLACEHOLDER
- CPU_PLACEHOLDER
- MEMORY_PLACEHOLDER
- LOG_GROUP_PLACEHOLDER

## Replacement Strategy
```bash
sed -e "s|AWS_REGION_PLACEHOLDER|$AWS_REGION|g" \
    -e "s|IMAGE_PLACEHOLDER|$ECR_IMAGE|g" \
    ecs-task-definition.json > task-definition-final.json
```

## GitHub Environment Variables
Configure in GitHub UI under Settings > Environments > QA:
- AWS_REGION
- ECS_CLUSTER
- ECS_SERVICE_API
- ECS_SERVICE_WEB
- TASK_DEFINITION_FAMILY
