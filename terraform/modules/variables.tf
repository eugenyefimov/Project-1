variable "primary_region" {
  description = "The primary AWS region"
  type        = string
  default     = "us-east-1"
}

variable "secondary_region" {
  description = "The secondary AWS region for disaster recovery"
  type        = string
  default     = "us-west-2"
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.medium"
}

variable "app_name" {
  description = "Name of the application"
  type        = string
  default     = "multi-region-app"
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
}

variable "github_org" {
  description = "GitHub organization name"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
}

