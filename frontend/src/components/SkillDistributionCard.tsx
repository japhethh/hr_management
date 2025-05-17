import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { SkillDistribution } from "@/types"

interface SkillDistributionCardProps {
  distribution: SkillDistribution
  isLoading: boolean
  title?: string
  description?: string
}

export const SkillDistributionCard: React.FC<SkillDistributionCardProps> = ({
  distribution,
  isLoading,
  title = "Skill Distribution",
  description = "Overview of employee skill levels",
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <p className="text-muted-foreground">Loading skill distribution...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const total = distribution.Beginner + distribution.Intermediate + distribution.Advanced + distribution.Expert

  // Calculate percentages
  const getPercentage = (value: number) => {
    if (total === 0) return 0
    return Math.round((value / total) * 100)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Beginner</span>
              <span>
                {distribution.Beginner} ({getPercentage(distribution.Beginner)}%)
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${getPercentage(distribution.Beginner)}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Intermediate</span>
              <span>
                {distribution.Intermediate} ({getPercentage(distribution.Intermediate)}%)
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${getPercentage(distribution.Intermediate)}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Advanced</span>
              <span>
                {distribution.Advanced} ({getPercentage(distribution.Advanced)}%)
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${getPercentage(distribution.Advanced)}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Expert</span>
              <span>
                {distribution.Expert} ({getPercentage(distribution.Expert)}%)
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 rounded-full"
                style={{ width: `${getPercentage(distribution.Expert)}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
