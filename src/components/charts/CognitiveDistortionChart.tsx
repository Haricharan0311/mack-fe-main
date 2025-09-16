import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApiCognitiveDistortionResponse } from '@/types/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { useMemo } from 'react';

interface DistortionData {
  type: string;
  count: number;
  recentExcerpt: string;
  color: string;
}

interface CognitiveDistortionChartProps {
  data: ApiCognitiveDistortionResponse[] | null;
  loading: boolean;
  error: string | null;
}

const DISTORTION_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  '#8884d8',
  '#82ca9d',
  '#ffc658'
];

const transformDistortionData = (apiData: ApiCognitiveDistortionResponse[]): DistortionData[] => {
  if (!apiData || !Array.isArray(apiData)) return [];
  
  const distortionMap: { [key: string]: { count: number; recentExcerpt: string; latestDate: string } } = {};
  
  // Group by distortion type and find most recent excerpt
  apiData.forEach((item) => {
    const type = item.distortion_type;
    if (!distortionMap[type]) {
      distortionMap[type] = {
        count: 0,
        recentExcerpt: item.voice_note_excerpt,
        latestDate: item.created_at
      };
    }
    
    distortionMap[type].count += 1;
    
    // Update with most recent excerpt
    if (new Date(item.created_at) > new Date(distortionMap[type].latestDate)) {
      distortionMap[type].recentExcerpt = item.voice_note_excerpt;
      distortionMap[type].latestDate = item.created_at;
    }
  });
  
  // Convert to array and sort by count
  return Object.entries(distortionMap)
    .map(([type, data], index) => ({
      type: type.length > 20 ? type.substring(0, 17) + '...' : type,
      fullType: type,
      count: data.count,
      recentExcerpt: data.recentExcerpt,
      color: DISTORTION_COLORS[index % DISTORTION_COLORS.length]
    }))
    .sort((a, b) => b.count - a.count);
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-md max-w-xs">
        <p className="font-medium text-sm mb-2">{data.fullType || label}</p>
        <p className="text-sm text-muted-foreground mb-2">
          Frequency: <span className="font-medium">{data.count}</span>
        </p>
        <div className="border-t pt-2">
          <p className="text-xs text-muted-foreground mb-1">Recent example:</p>
          <p className="text-xs italic">"{data.recentExcerpt}"</p>
        </div>
      </div>
    );
  }
  return null;
};

export function CognitiveDistortionChart({ data, loading, error }: CognitiveDistortionChartProps) {
  const distortionData = useMemo(() => data ? transformDistortionData(data) : [], [data]);
  const maxValue = Math.max(...distortionData.map(d => d.count), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cognitive Distortion Frequency</CardTitle>
        <p className="text-sm text-muted-foreground">
          Clinical Question: How much of the patient's speech is distorted thinking, and what types dominate?<br />
          Hover over bars to see recent examples from voice notes
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Loading cognitive distortion data...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-destructive">{error}</p>
            </div>
          ) : distortionData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No cognitive distortion data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distortionData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="type"
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
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {distortionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        {distortionData.length > 0 && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-1 gap-2 text-xs">
              {distortionData.slice(0, 3).map((item) => (
                <div key={item.fullType} className="flex justify-between px-2 py-1 rounded-md bg-muted/50">
                  <span className="font-medium">{item.fullType}</span>
                  <span className="text-muted-foreground">{item.count} occurrences</span>
                </div>
              ))}
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Why it matters:</strong> Cognitive distortions are thought patterns that reinforce negative behaviors. 
                Identifying the most frequent types helps target specific therapeutic interventions.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
