import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { ApiMoodChartResponse } from '@/types/chart';

interface MoodDataPoint {
  date: string;
  valence: number;
  movingAverage: number;
}

interface MoodChartProps {
  data: ApiMoodChartResponse | null;
  loading: boolean;
  error: string | null;
}

// Function to transform API data into chart format
const transformApiData = (apiData: ApiMoodChartResponse): MoodDataPoint[] => {
  return apiData.dates.map((date, index) => {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    
    return {
      date: formattedDate,
      valence: apiData.valenceScores[index],
      movingAverage: apiData.movingAverage[index]
    };
  });
};

export function MoodChart({ data, loading, error }: MoodChartProps) {
  const moodData = data ? transformApiData(data) : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood Fluctuation Tracker</CardTitle>
        <p className="text-sm text-muted-foreground">
          Clinical Question: How is the patient's emotional state evolving day by day?
        </p>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-chart-1"></div>
            <span>Valence</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-chart-2"></div>
            <span>Moving Average</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-chart-3"></div>
            <span>Above Average</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Loading mood data...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-destructive">{error}</p>
            </div>
          ) : moodData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No mood data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  domain={[-10, 10]}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="valence" 
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="movingAverage" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="mt-4 p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Why it matters:</strong> Mood instability is a key relapse signal. Sudden dips may reflect 
            triggers or cognitive spirals that require immediate therapeutic intervention.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}