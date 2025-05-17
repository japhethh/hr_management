import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { ReviewStats } from "@/types"

interface RatingDistributionCardProps {
  stats: ReviewStats | undefined
  isLoading: boolean
}

export function RatingDistributionCard({ stats, isLoading }: RatingDistributionCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
          <CardDescription>Distribution of performance ratings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <p className="text-muted-foreground">Loading rating distribution...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
          <CardDescription>Distribution of performance ratings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <p className="text-muted-foreground">No data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const maxCount = Math.max(
    stats.ratingDistribution["1"],
    stats.ratingDistribution["2"],
    stats.ratingDistribution["3"],
    stats.ratingDistribution["4"],
    stats.ratingDistribution["5"],
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rating Distribution</CardTitle>
        <CardDescription>Distribution of performance ratings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[5, 4, 3, 2, 1].map((rating) => {
            // Convert the number to a string to use as a key
            const ratingKey = rating.toString() as keyof typeof stats.ratingDistribution
            const count = stats.ratingDistribution[ratingKey]
            const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0

            return (
              <div key={rating} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    {rating} {rating === 1 ? "Star" : "Stars"}
                  </span>
                  <span>{count} reviews</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${rating >= 4
                      ? "bg-green-500"
                      : rating >= 3
                        ? "bg-blue-500"
                        : rating >= 2
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
