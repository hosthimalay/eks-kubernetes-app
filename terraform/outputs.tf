output "cluster_name" { value = aws_eks_cluster.main.name }
output "cluster_endpoint" { value = aws_eks_cluster.main.endpoint }
output "ecr_repository_uri" { value = aws_ecr_repository.app.repository_url }
output "kubeconfig_command" {
  value = "aws eks update-kubeconfig --name ${aws_eks_cluster.main.name} --region ${var.aws_region}"
}
