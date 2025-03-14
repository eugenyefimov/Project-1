output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.main.id
}

output "load_balancer_dns" {
  description = "The DNS name of the load balancer"
  value       = aws_lb.app.dns_name
}

output "load_balancer_arn" {
  description = "The ARN of the load balancer"
  value       = aws_lb.app.arn
}
