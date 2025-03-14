import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function DeploymentGuide() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Multi-Region Deployment Guide</h1>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          This guide assumes you have AWS and Vercel accounts set up with appropriate permissions.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="prerequisites">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="prerequisites">Prerequisites</TabsTrigger>
          <TabsTrigger value="terraform">Terraform Setup</TabsTrigger>
          <TabsTrigger value="cicd">CI/CD Pipeline</TabsTrigger>
          <TabsTrigger value="vercel">Vercel Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="prerequisites" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Required Tools</CardTitle>
              <CardDescription>Software you'll need to install</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Terraform CLI (v1.0+)</p>
                  <p className="text-sm text-muted-foreground">Infrastructure as Code tool</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">AWS CLI</p>
                  <p className="text-sm text-muted-foreground">For AWS authentication and management</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Git</p>
                  <p className="text-sm text-muted-foreground">For source control</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">GitHub Account</p>
                  <p className="text-sm text-muted-foreground">For CI/CD integration</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Vercel Account</p>
                  <p className="text-sm text-muted-foreground">For frontend deployment</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Required Credentials</CardTitle>
              <CardDescription>API keys and access tokens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">AWS Access Key & Secret Key</p>
                  <p className="text-sm text-muted-foreground">
                    With permissions to create EC2, VPC, ELB, and Route53 resources
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Vercel API Token</p>
                  <p className="text-sm text-muted-foreground">For Terraform to manage Vercel resources</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">GitHub Personal Access Token</p>
                  <p className="text-sm text-muted-foreground">For CI/CD workflow</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="terraform" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Terraform Configuration</CardTitle>
              <CardDescription>Setting up your infrastructure code</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">1. Clone the Repository</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>git clone https://github.com/your-org/multi-region-infra.git</code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">2. Initialize Terraform</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>cd terraform terraform init</code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">3. Configure Variables</h3>
                <p className="mb-2">Create a terraform.tfvars file with your configuration:</p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>
                    primary_region = "us-east-1" secondary_region = "us-west-2" environment = "prod" instance_type =
                    "t3.medium" app_name = "your-app-name" domain_name = "yourdomain.com" github_org = "your-github-org"
                    github_repo = "your-github-repo"
                  </code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">4. Plan and Apply</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>terraform plan terraform apply</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cicd" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CI/CD Pipeline Setup</CardTitle>
              <CardDescription>Automating your infrastructure deployment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">1. Set Up GitHub Secrets</h3>
                <p>Add the following secrets to your GitHub repository:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>AWS_ACCESS_KEY_ID</li>
                  <li>AWS_SECRET_ACCESS_KEY</li>
                  <li>VERCEL_API_TOKEN</li>
                  <li>DOMAIN_NAME</li>
                  <li>GITHUB_ORG</li>
                  <li>GITHUB_REPO</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">2. Create GitHub Actions Workflow</h3>
                <p>Copy the deploy.yml file to .github/workflows/ in your repository</p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">3. Commit and Push</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>git add . git commit -m "Add CI/CD workflow" git push origin main</code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">4. Monitor Workflow</h3>
                <p>Check the Actions tab in your GitHub repository to monitor the deployment</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vercel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vercel Integration</CardTitle>
              <CardDescription>Connecting your frontend with the backend infrastructure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">1. Generate Vercel API Token</h3>
                <p>Create a token in the Vercel dashboard under Account Settings → Tokens</p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">2. Connect GitHub Repository</h3>
                <p>Terraform will automatically connect your GitHub repository to Vercel</p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">3. Environment Variables</h3>
                <p>Terraform will automatically set up the API_URL environment variable in Vercel</p>
                <p>You can add additional environment variables in the Vercel dashboard or through Terraform</p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">4. Custom Domains</h3>
                <p>Terraform will configure your custom domain in Vercel</p>
                <p>Ensure your domain's DNS is properly configured to point to Vercel</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

