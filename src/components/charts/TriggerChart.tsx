import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApiTriggerChartResponse } from '@/types/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

interface TriggerData {
  trigger: string;
  count: number;
}

interface TriggerChartProps {
  data: ApiTriggerChartResponse | null;
  loading: boolean;
  error: string | null;
}

// Function to transform API data into chart format
const transformTriggerData = (apiData: ApiTriggerChartResponse): TriggerData[] => {
  if (!apiData?.triggersByDay) return [];
  
  const triggerCounts: { [key: string]: number } = {};
  
  // Count triggers across all days
  Object.values(apiData.triggersByDay).forEach((dayTriggers) => {
    if (dayTriggers) {
      Object.entries(dayTriggers).forEach(([trigger, count]) => {
        triggerCounts[trigger] = (triggerCounts[trigger] || 0) + count;
      });
    }
  });
  
  // Convert to array and sort by count
  return Object.entries(triggerCounts)
    .map(([trigger, count]) => ({
      trigger: trigger.charAt(0).toUpperCase() + trigger.slice(1),
      count: Math.round(count * 10) / 10 // Round to 1 decimal place
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6); // Top 6 triggers for better display
};

export function TriggerChart({ data, loading, error }: TriggerChartProps) {
  const triggerData = data ? transformTriggerData(data) : [];
  const maxValue = Math.max(...triggerData.map(d => d.count), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Triggers Bar Chart</CardTitle>
        <p className="text-sm text-muted-foreground">
          Clinical Question: What are the most frequent relapse triggers?<br />
          Frequency of identified triggers leading to disordered eating behaviors
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Loading trigger data...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-destructive">{error}</p>
            </div>
          ) : triggerData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No trigger data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={triggerData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="trigger"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  domain={[0, Math.max(maxValue * 1.1, 1)]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [value.toFixed(1), 'Intensity']}
                />
                <Bar 
                  dataKey="count" 
                  fill="hsl(var(--chart-2))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        {triggerData.length > 0 && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              {triggerData.map((item) => (
                <div key={item.trigger} className="flex justify-between px-2 py-1 rounded-md bg-muted/50">
                  <span className="font-medium">{item.trigger}</span>
                  <span className="text-muted-foreground">{item.count.toFixed(1)}</span>
                </div>
              ))}
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Why it matters:</strong> These intensity scores help identify which triggers have the strongest impact on the patient's emotional state, enabling targeted therapeutic interventions.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}