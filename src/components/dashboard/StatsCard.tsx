import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon?: LucideIcon;
  variant?: 'default' | 'warning' | 'destructive';
  subtitle?: string;
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  variant = 'default',
  subtitle 
}: StatsCardProps) {
  const getChangeColor = () => {
    if (!change) return '';
    switch (change.type) {
      case 'increase': return 'text-success';
      case 'decrease': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return 'border-warning/20 bg-warning/5';
      case 'destructive':
        return 'border-destructive/20 bg-destructive/5';
      default:
        return '';
    }
  };

  return (
    <Card className={cn('transition-all hover:shadow-lg', getVariantStyles())}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">{value}</p>
              {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              )}
            </div>
            {change && (
              <p className={cn('text-xs font-medium', getChangeColor())}>
                {change.value}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}