# Main Terraform configuration file

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.11"
    }
  }
}

# Configure the AWS Provider for primary region
provider "aws" {
  region = var.primary_region
  alias  = "primary"
}

# Configure the AWS Provider for secondary region
provider "aws" {
  region = var.secondary_region
  alias  = "secondary"
}

# Configure the Vercel Provider
provider "vercel" {
  # API token is read from VERCEL_API_TOKEN environment variable
}

# Import modules for each region
module "primary_region" {
  source = "./modules/region"
  
  providers = {
    aws = aws.primary
  }
  
  region_name       = var.primary_region
  environment       = var.environment
  instance_type     = var.instance_type
  app_name          = var.app_name
  is_primary_region = true
}

module "secondary_region" {
  source = "./modules/region"
  
  providers = {
    aws = aws.secondary
  }
  
  region_name       = var.secondary_region
  environment       = var.environment
  instance_type     = var.instance_type
  app_name          = var.app_name
  is_primary_region = false
}

# Route53 Global Load Balancer
resource "aws_route53_zone" "primary" {
  name = var.domain_name
  
  provider = aws.primary
}

resource "aws_route53_health_check" "primary" {
  fqdn              = module.primary_region.load_balancer_dns
  port              = 80
  type              = "HTTP"
  resource_path     = "/health"
  failure_threshold = 3
  request_interval  = 30
  
  provider = aws.primary
  
  tags = {
    Name = "${var.app_name}-primary-health-check"
  }
}

resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = "api.${var.domain_name}"
  type    = "CNAME"
  
  failover_routing_policy {
    type = "PRIMARY"
  }
  
  health_check_id = aws_route53_health_check.primary.id
  set_identifier  = "primary"
  ttl             = 60
  records         = [module.primary_region.load_balancer_dns]
  
  provider = aws.primary
}

resource "aws_route53_record" "www_secondary" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = "api.${var.domain_name}"
  type    = "CNAME"
  
  failover_routing_policy {
    type = "SECONDARY"
  }
  
  set_identifier = "secondary"
  ttl            = 60
  records        = [module.secondary_region.load_balancer_dns]
  
  provider = aws.primary
}

# Vercel Project
resource "vercel_project" "frontend" {
  name      = var.app_name
  framework = "nextjs"
  
  git_repository = {
    type = "github"
    repo = "${var.github_org}/${var.github_repo}"
  }
  
  environment = [
    {
      key    = "API_URL"
      value  = "https://api.${var.domain_name}"
      target = ["production", "preview"]
    }
  ]
}

# Vercel Domain Configuration
resource "vercel_project_domain" "frontend" {
  project_id = vercel_project.frontend.id
  domain     = var.domain_name
}