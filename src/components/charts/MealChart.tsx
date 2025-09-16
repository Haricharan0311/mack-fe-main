import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApiMealChartResponse } from '@/types/chart';

interface MealChartProps {
  data: ApiMealChartResponse | null;
  loading: boolean;
  error: string | null;
}

const getColorClass = (color: string): string => {
  switch (color) {
    case 'green':
      return 'bg-green-500';
    case 'yellow':
      return 'bg-yellow-500';
    case 'red':
      return 'bg-red-500';
    case 'gray':
      return 'bg-gray-400';
    default:
      return 'bg-gray-400';
  }
};

export function MealChart({ data, loading, error }: MealChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meal Pattern Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">Loading meal data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meal Pattern Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-destructive">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.grid.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meal Pattern Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">No meal data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meal Pattern Heatmap</CardTitle>
        <p className="text-sm text-muted-foreground">
          Clinical Question: How consistently does the patient follow meals throughout the week?
        </p>
        <div className="flex items-center space-x-4 text-xs mt-2">
          {data.colorLegend && Object.entries(data.colorLegend).map(([color, label]) => (
            <div key={color} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getColorClass(color)}`}></div>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Header row with day labels */}
          <div className="grid grid-cols-8 gap-2">
            <div className="text-sm font-medium text-muted-foreground"></div>
            {data.dateLabels.map((dateLabel) => (
              <div key={dateLabel.date} className="text-center">
                <div className="text-sm font-medium text-muted-foreground">
                  {dateLabel.dayOfWeek.slice(0, 3)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {dateLabel.label.split(' ')[1]}
                </div>
              </div>
            ))}
          </div>
          
          {/* Meal rows */}
          {data.grid.map((mealRow) => (
            <div key={mealRow.mealType} className="grid grid-cols-8 gap-2 items-center">
              <div className="text-sm font-medium capitalize text-left">
                {mealRow.mealType}
              </div>
              {data.dateLabels.map((dateLabel) => {
                const mealData = mealRow[dateLabel.date];
                return (
                  <div key={dateLabel.date} className="flex justify-center">
                    <div 
                      className={`w-12 h-12 rounded ${getColorClass(mealData?.color || 'gray')} flex items-center justify-center`}
                      title={`${mealRow.mealType} - ${dateLabel.dayOfWeek}: ${mealData?.level || 'No data'}`}
                    >
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Why it matters:</strong> Eating patterns reveal behavioral control and relapse markers. Gaps or 
            inconsistencies in meal patterns are significant risk indicators for eating disorder relapse.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
