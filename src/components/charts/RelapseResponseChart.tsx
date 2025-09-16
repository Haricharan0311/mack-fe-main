import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApiRelapseResponseResponse } from '@/types/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useMemo } from 'react';

interface RelapseResponseData {
  category: string;
  'Body Image': number;
  'Social Stress': number;
  'Shame': number;
  'Comparison': number;
  'Anxiety/Fear': number;
  'Perfectionism': number;
  'Loss of Control': number;
  'Loneliness': number;
}

interface RelapseResponseChartProps {
  data: ApiRelapseResponseResponse[] | null;
  loading: boolean;
  error: string | null;
}

const RESPONSE_COLORS = {
  'Body Image': '#8b5cf6',
  'Social Stress': '#06b6d4',
  'Shame': '#ef4444',
  'Comparison': '#f59e0b',
  'Anxiety/Fear': '#10b981',
  'Perfectionism': '#6366f1',
  'Loss of Control': '#ec4899',
  'Loneliness': '#84cc16'
};

const RESPONSE_LABELS = {
  body_image: 'Body Image',
  social_stress: 'Social Stress',
  shame: 'Shame',
  comparison: 'Comparison',
  anxiety_fear: 'Anxiety/Fear',
  perfectionism: 'Perfectionism',
  loss_of_control: 'Loss of Control',
  loneliness: 'Loneliness'
};

const transformRelapseResponseData = (apiData: ApiRelapseResponseResponse[]): RelapseResponseData[] => {
  if (!apiData || !Array.isArray(apiData)) return [];
  
  // Group by category and calculate totals
  const categoryMap = new Map<string, { [key: string]: number }>();
  
  apiData.forEach((item) => {
    const category = item.category;
    
    if (!categoryMap.has(category)) {
      categoryMap.set(category, {
        body_image: 0,
        social_stress: 0,
        shame: 0,
        comparison: 0,
        anxiety_fear: 0,
        perfectionism: 0,
        loss_of_control: 0,
        loneliness: 0
      });
    }
    
    const categoryData = categoryMap.get(category)!;
    categoryData.body_image += item.body_image;
    categoryData.social_stress += item.social_stress;
    categoryData.shame += item.shame;
    categoryData.comparison += item.comparison;
    categoryData.anxiety_fear += item.anxiety_fear;
    categoryData.perfectionism += item.perfectionism;
    categoryData.loss_of_control += item.loss_of_control;
    categoryData.loneliness += item.loneliness;
  });
  
  // Convert to percentage data with proper rounding to ensure 100% total
  return Array.from(categoryMap.entries()).map(([category, totals]) => {
    const totalSum = Object.values(totals).reduce((sum, val) => sum + val, 0);
    
    if (totalSum === 0) {
      return {
        category,
        'Body Image': 0,
        'Social Stress': 0,
        'Shame': 0,
        'Comparison': 0,
        'Anxiety/Fear': 0,
        'Perfectionism': 0,
        'Loss of Control': 0,
        'Loneliness': 0
      };
    }

    // Calculate raw percentages
    const responseKeys = ['Body Image', 'Social Stress', 'Shame', 'Comparison', 'Anxiety/Fear', 'Perfectionism', 'Loss of Control', 'Loneliness'];
    const rawKeys = ['body_image', 'social_stress', 'shame', 'comparison', 'anxiety_fear', 'perfectionism', 'loss_of_control', 'loneliness'];
    
    const rawPercentages = responseKeys.map((_, index) => {
      return (totals[rawKeys[index]] / totalSum) * 100;
    });

    // Round percentages to integers
    const roundedPercentages = rawPercentages.map(p => Math.round(p));
    
    // Adjust to ensure they add up to 100
    const currentSum = roundedPercentages.reduce((sum, p) => sum + p, 0);
    const difference = 100 - currentSum;
    
    if (difference !== 0) {
      // Find the largest raw percentage and adjust it
      const maxIndex = rawPercentages.indexOf(Math.max(...rawPercentages));
      roundedPercentages[maxIndex] += difference;
    }
    
    return {
      category,
      'Body Image': roundedPercentages[0],
      'Social Stress': roundedPercentages[1],
      'Shame': roundedPercentages[2],
      'Comparison': roundedPercentages[3],
      'Anxiety/Fear': roundedPercentages[4],
      'Perfectionism': roundedPercentages[5],
      'Loss of Control': roundedPercentages[6],
      'Loneliness': roundedPercentages[7]
    };
  }).sort((a, b) => a.category.localeCompare(b.category));
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
    
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-md">
        <p className="font-medium text-sm mb-2">{label}</p>
        {payload
          .filter((entry: any) => entry.value > 0)
          .sort((a: any, b: any) => b.value - a.value)
          .map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span>{entry.dataKey}</span>
              </div>
              <span className="font-medium">{entry.value}%</span>
            </div>
          ))}
        <div className="border-t pt-2 mt-2 text-xs text-muted-foreground">
          Total: {total}%
        </div>
      </div>
    );
  }
  return null;
};

export function RelapseResponseChart({ data, loading, error }: RelapseResponseChartProps) {
  const chartData = useMemo(() => data ? transformRelapseResponseData(data) : [], [data]);

  // Debug logging
  console.log('RelapseResponseChart - Raw data:', data);
  console.log('RelapseResponseChart - Transformed data:', chartData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relapse Response Patterns</CardTitle>
        <p className="text-sm text-muted-foreground">
          Clinical Question: What emotional responses dominate during relapse episodes by context?<br />
          Percentage breakdown of psychological responses within each relapse category
        </p>
        <div className="grid grid-cols-4 gap-2 text-xs mt-2">
          {Object.entries(RESPONSE_COLORS).map(([response, color]) => (
            <div key={response} className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
              <span className="truncate">{response}</span>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Loading relapse response data...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-destructive">{error}</p>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No relapse response data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  type="number"
                  domain={[0, 100]}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `${value}%`}
                />
                <YAxis 
                  dataKey="category"
                  type="category"
                  width={80}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                
                <Bar dataKey="Body Image" stackId="a" fill={RESPONSE_COLORS['Body Image']} />
                <Bar dataKey="Social Stress" stackId="a" fill={RESPONSE_COLORS['Social Stress']} />
                <Bar dataKey="Shame" stackId="a" fill={RESPONSE_COLORS['Shame']} />
                <Bar dataKey="Comparison" stackId="a" fill={RESPONSE_COLORS['Comparison']} />
                <Bar dataKey="Anxiety/Fear" stackId="a" fill={RESPONSE_COLORS['Anxiety/Fear']} />
                <Bar dataKey="Perfectionism" stackId="a" fill={RESPONSE_COLORS['Perfectionism']} />
                <Bar dataKey="Loss of Control" stackId="a" fill={RESPONSE_COLORS['Loss of Control']} />
                <Bar dataKey="Loneliness" stackId="a" fill={RESPONSE_COLORS['Loneliness']} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        {chartData.length > 0 && (
          <div className="mt-4 space-y-3">
            <div className="text-xs text-muted-foreground mb-2">
              Categories found: {chartData.map(item => item.category).join(', ')}
            </div>
            <div className="grid grid-cols-1 gap-2 text-xs">
              {chartData.map((item) => {
                const topResponses = Object.entries(item)
                  .filter(([key]) => key !== 'category')
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .slice(0, 2);
                
                const total = Object.entries(item)
                  .filter(([key]) => key !== 'category')
                  .reduce((sum, [, value]) => sum + (value as number), 0);
                
                return (
                  <div key={item.category} className="flex justify-between px-2 py-1 rounded-md bg-muted/50">
                    <span className="font-medium">{item.category}</span>
                    <span className="text-muted-foreground">
                      Top: {topResponses.map(([response, percentage]) => `${response} (${percentage}%)`).join(', ')} | Total: {total}%
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Why it matters:</strong> Different relapse contexts trigger distinct emotional response patterns. 
                Understanding these patterns helps tailor context-specific intervention strategies and identify which 
                emotional regulation skills to prioritize for each situation type.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}