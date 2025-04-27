// components/StreakCard.jsx
import { Flame } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function StreakCard({ streak }) {
  return (
    <Card className="flex items-center gap-4 p-4">
      <Flame className="text-orange-500" size={32} />
      <div>
        <div className="text-xl font-semibold">{streak} day{streak !== 1 ? "s" : ""}</div>
        <div className="text-muted-foreground text-sm">Current study streak</div>
      </div>
    </Card>
  )
}
