import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
}

export function KPICard({
  title,
  value,
  change,
  changeLabel,
  icon,
  trend = 'neutral'
}: KPICardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {change !== undefined && (
              <div className={cn("flex items-center gap-1 mt-1 text-sm", trendColor)}>
                <TrendIcon size={14} />
                <span>{change > 0 ? '+' : ''}{change}%</span>
                {changeLabel && <span className="text-gray-400">{changeLabel}</span>}
              </div>
            )}
          </div>
          {icon && (
            <div className="p-3 bg-ness-cyan/10 rounded-lg text-ness-cyan">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
