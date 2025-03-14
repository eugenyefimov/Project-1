# Multi-Region Infrastructure Deployment Guide

This guide will walk you through deploying the multi-region infrastructure using Terraform and GitHub Actions.

## Prerequisites

Before you begin, ensure you have:

1. **AWS Account** with appropriate permissions
2. **Vercel Account** for frontend deployment
3. **GitHub Account** for repository hosting and CI/CD
4. **Domain Name** that you control for DNS configuration

## Required Tools

- Terraform CLI (v1.0+)
- AWS CLI
- Git

## Setup Steps

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/Project-1.git
cd Project-1

### 2. Configure Terraform Variables
Create or modify the terraform/terraform.tfvars file with your specific values:

```terraform
primary_region   = "us-east-1"
secondary_region = "us-west-2"
environment      = "prod"
instance_type    = "t3.medium"
app_name         = "your-app-name"
domain_name      = "yourdomain.com"
github_org       = "your-github-org"
github_repo      = "Project-1"
 ```

### 3. Set Up GitHub Secrets
Add the following secrets to your GitHub repository:

- AWS_ACCESS_KEY_ID : Your AWS access key
- AWS_SECRET_ACCESS_KEY : Your AWS secret key
- VERCEL_API_TOKEN : Your Vercel API token
- DOMAIN_NAME : Your domain name
- GITHUB_ORG : Your GitHub organization name
- GITHUB_REPO : Your GitHub repository name
### 4. Manual Deployment (Optional)
If you want to deploy manually before setting up CI/CD:

```bash
cd terraform
terraform init
terraform plan
terraform apply
 ```

### 5. CI/CD Deployment
Push your changes to the main branch to trigger the GitHub Actions workflow:

```bash
git add .
git commit -m "Initial infrastructure setup"
git push origin main
 ```

### 6. Verify Deployment
1. Check the GitHub Actions tab to monitor the deployment progress
2. Verify AWS resources in both regions through the AWS Console
3. Confirm the Vercel project is created and deployed
4. Test the failover capability by simulating a failure in the primary region

## Architecture Overview
This deployment creates:

- VPCs in two AWS regions with public subnets
- Auto Scaling Groups with EC2 instances in each region
- Application Load Balancers in each region
- Route53 DNS with health checks and failover routing
- Vercel frontend deployment connected to the multi-region backend

## Troubleshooting
If you encounter issues:

1. Check the GitHub Actions logs for error messages
2. Verify your AWS and Vercel credentials are correct
3. Ensure your domain's DNS is properly configured
4. Check the AWS CloudWatch logs for any application errors
```plaintext

## 6. Create a Basic README for the App Directory

```markdown:c%3A%5CUsers%5Cdci-student%5CDocuments%5CProject-1%5CProject-1%5Capp%5CREADME.md
# Multi-Region Infrastructure Frontend

This directory contains the frontend application for the multi-region infrastructure project.

## Overview

The frontend is a Next.js application that connects to the multi-region backend API. It's deployed on Vercel and automatically configured through Terraform.

## Development

To run the application locally:

```bash
npm install
npm run dev
 ```
```

## Environment Variables
The following environment variables are automatically set by Terraform:

- API_URL : The URL of the backend API (e.g., https://api.yourdomain.com )
## Deployment
The application is automatically deployed to Vercel when changes are pushed to the main branch. The deployment is managed through Terraform and GitHub Actions.

## Architecture
This frontend application is part of a larger multi-region infrastructure:

- Frontend: Deployed on Vercel's global edge network
- Backend: Distributed across multiple AWS regions
- DNS: Route53 with failover routing for high availability


