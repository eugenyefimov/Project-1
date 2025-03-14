variable "region_name" {
  description = "The AWS region name"
  type        = string
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
}

variable "app_name" {
  description = "Name of the application"
  type        = string
}

variable "is_primary_region" {
  description = "Whether this is the primary region"
  type        = bool
  default     = false
}
