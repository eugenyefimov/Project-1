# VPC Configuration
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  
  tags = {
    Name        = "${var.app_name}-vpc-${var.region_name}"
    Environment = var.environment
  }
}

# Create public subnets in different availability zones
resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.${count.index + 1}.0/24"
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true
  
  tags = {
    Name        = "${var.app_name}-public-subnet-${count.index + 1}-${var.region_name}"
    Environment = var.environment
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  
  tags = {
    Name        = "${var.app_name}-igw-${var.region_name}"
    Environment = var.environment
  }
}

# Route table for public subnets
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }
  
  tags = {
    Name        = "${var.app_name}-public-rt-${var.region_name}"
    Environment = var.environment
  }
}

# Associate route table with public subnets
resource "aws_route_table_association" "public" {
  count          = 2
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# Security Group for EC2 instances
resource "aws_security_group" "ec2" {
  name        = "${var.app_name}-ec2-sg-${var.region_name}"
  description = "Security group for EC2 instances"
  vpc_id      = aws_vpc.main.id
  
  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name        = "${var.app_name}-ec2-sg-${var.region_name}"
    Environment = var.environment
  }
}

# Security Group for ALB
resource "aws_security_group" "alb" {
  name        = "${var.app_name}-alb-sg-${var.region_name}"
  description = "Security group for Application Load Balancer"
  vpc_id      = aws_vpc.main.id
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name        = "${var.app_name}-alb-sg-${var.region_name}"
    Environment = var.environment
  }
}

# Launch Template for EC2 instances
resource "aws_launch_template" "app" {
  name_prefix   = "${var.app_name}-lt-${var.region_name}-"
  image_id      = data.aws_ami.amazon_linux.id
  instance_type = var.instance_type
  
  vpc_security_group_ids = [aws_security_group.ec2.id]
  
  user_data = base64encode(<<-EOF
    #!/bin/bash
    yum update -y
    yum install -y httpd
    systemctl start httpd
    systemctl enable httpd
    echo "<html><body><h1>Hello from ${var.region_name} region!</h1></body></html>" > /var/www/html/index.html
    echo "OK" > /var/www/html/health
    EOF
  )
  
  tag_specifications {
    resource_type = "instance"
    
    tags = {
      Name        = "${var.app_name}-instance-${var.region_name}"
      Environment = var.environment
    }
  }
}

# Auto Scaling Group
resource "aws_autoscaling_group" "app" {
  name                = "${var.app_name}-asg-${var.region_name}"
  min_size            = 2
  max_size            = 5
  desired_capacity    = 2
  vpc_zone_identifier = aws_subnet.public[*].id
  
  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }
  
  target_group_arns = [aws_lb_target_group.app.arn]
  
  health_check_type         = "ELB"
  health_check_grace_period = 300
  
  tag {
    key                 = "Name"
    value               = "${var.app_name}-asg-${var.region_name}"
    propagate_at_launch = true
  }
  
  tag {
    key                 = "Environment"
    value               = var.environment
    propagate_at_launch = true
  }
}

# Application Load Balancer
resource "aws_lb" "app" {
  name               = "${var.app_name}-alb-${var.region_name}"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id
  
  tags = {
    Name        = "${var.app_name}-alb-${var.region_name}"
    Environment = var.environment
  }
}

# ALB Target Group
resource "aws_lb_target_group" "app" {
  name     = "${var.app_name}-tg-${var.region_name}"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id
  
  health_check {
    path                = "/health"
    port                = "traffic-port"
    healthy_threshold   = 3
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
  }
  
  tags = {
    Name        = "${var.app_name}-tg-${var.region_name}"
    Environment = var.environment
  }
}

# ALB Listener
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.app.arn
  port              = 80
  protocol          = "HTTP"
  
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}

# Auto Scaling Policy
resource "aws_autoscaling_policy" "app" {
  name                   = "${var.app_name}-scaling-policy-${var.region_name}"
  autoscaling_group_name = aws_autoscaling_group.app.name
  policy_type            = "TargetTrackingScaling"
  
  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }
    target_value = 70.0
  }
}

