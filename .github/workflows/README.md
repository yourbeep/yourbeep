# Deployment workflow notes

This repo uses `.github/workflows/deploy-production.yml` to:

1. build and push Docker images for:
   - `gateway`
   - `identity`
   - `content`
   - `commerce`
2. update an ops repo manifest with the new image SHA tags

## Required secrets

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`
- `YOURBEEP_PAT`

## Default assumptions

- Docker image repository:
  - `<DOCKERHUB_USERNAME>/yourbeep`
- Docker image tags:
  - `gateway-<sha>`
  - `identity-<sha>`
  - `content-<sha>`
  - `commerce-<sha>`
- Latest tags:
  - `gateway-latest`
  - `identity-latest`
  - `content-latest`
  - `commerce-latest`
- Ops repo:
  - `chemic07/yourbeep_ops`
- Ops repo manifest path:
  - `manifest.yml`
