import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CloudIcon, GlobeIcon, ServerIcon, ShieldIcon } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">Multi-Region Infrastructure</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GlobeIcon className="h-5 w-5" />
                Global Edge Network
              </CardTitle>
              <CardDescription>Vercel's global edge network for frontend delivery</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Frontend deployed to Vercel's global edge network with automatic scaling and redundancy.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ServerIcon className="h-5 w-5" />
                Multi-Region Backend
              </CardTitle>
              <CardDescription>AWS infrastructure across multiple regions</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Backend services deployed across multiple AWS regions with automated failover.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudIcon className="h-5 w-5" />
                Infrastructure as Code
              </CardTitle>
              <CardDescription>Terraform for infrastructure provisioning</CardDescription>
            </CardHeader>
            <CardContent>
              <p>All infrastructure defined and managed through Terraform for consistency and repeatability.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldIcon className="h-5 w-5" />
                High Availability
              </CardTitle>
              <CardDescription>Resilient architecture with failover</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Automatic failover between regions ensures high availability and disaster recovery.</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Link href="/deployment-guide">
            <Button size="lg">View Deployment Guide</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}