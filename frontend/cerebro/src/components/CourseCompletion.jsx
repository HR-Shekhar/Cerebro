// components/CourseCompletion.jsx
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function CourseCompletion({ data }) {
  return (
    <div className="space-y-4">
      {Object.entries(data).map(([course, percentage]) => (
        <Card key={course}>
          <CardContent className="p-4">
            <div className="flex justify-between mb-1 text-sm font-medium text-muted-foreground">
              <span>{course}</span>
              <span>{percentage}%</span>
            </div>
            <Progress value={percentage} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
