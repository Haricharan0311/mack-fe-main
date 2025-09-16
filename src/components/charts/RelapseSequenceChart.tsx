import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApiRelapseSequenceResponse } from '@/types/chart';
import { useMemo } from 'react';
import { ResponsiveContainer } from 'recharts';
import { Sankey, Tooltip } from 'recharts';

interface SankeyNode {
  name: string;
  category: string;
  fullName?: string; // Added for tooltip
}

interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

interface RelapseSequenceChartProps {
  data: ApiRelapseSequenceResponse[] | null;
  loading: boolean;
  error: string | null;
}

const CATEGORY_COLORS = [
  '#8b5cf6', // circumstance
  '#06b6d4', // trigger  
  '#f59e0b', // emotion
  '#ef4444', // thought
  '#10b981'  // behavior
];

const transformToSankeyData = (data: ApiRelapseSequenceResponse[]): { nodes: SankeyNode[]; links: SankeyLink[] } => {
  if (!data || data.length === 0) return { nodes: [], links: [] };

  const nodeCountMap = new Map<string, number>();
  const linkMap = new Map<string, number>();
  const categories = ['circumstance', 'trigger', 'emotion', 'thought', 'behavior'];

  // First pass: count all nodes, excluding null/empty values
  data.forEach((sequence) => {
    const items = [
      { category: 'circumstance', value: sequence.circumstance },
      { category: 'trigger', value: sequence.trigger },
      { category: 'emotion', value: sequence.emotion },
      { category: 'thought', value: sequence.thought },
      { category: 'behavior', value: sequence.behavior }
    ].filter(item => item.value && item.value.toLowerCase() !== 'null' && item.value.trim() !== '');

    items.forEach((item) => {
      const nodeKey = `${item.category}:${item.value}`;
      nodeCountMap.set(nodeKey, (nodeCountMap.get(nodeKey) || 0) + 1);
    });
  });

  // Filter out low-frequency nodes (keep top 4-5 per category)
  const filteredNodesByCategory = categories.map(category => {
    const categoryNodes = Array.from(nodeCountMap.entries())
      .filter(([key]) => key.startsWith(`${category}:`))
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4); // Keep top 4 per category
    return categoryNodes;
  });

  // Build final node map with indices
  const nodeMap = new Map<string, number>();
  const nodes: SankeyNode[] = [];
  
  filteredNodesByCategory.forEach((categoryNodes) => {
    categoryNodes.forEach(([nodeKey, count]) => {
      const [category, name] = nodeKey.split(':');
      nodeMap.set(nodeKey, nodes.length);
      nodes.push({
        name: name.length > 12 ? name.substring(0, 9) + '...' : name,
        fullName: name, // Store the full name for tooltip
        category
      });
    });
  });

  // Second pass: count links between filtered nodes, excluding null values
  data.forEach((sequence) => {
    const items = [
      { category: 'circumstance', value: sequence.circumstance },
      { category: 'trigger', value: sequence.trigger },
      { category: 'emotion', value: sequence.emotion },
      { category: 'thought', value: sequence.thought },
      { category: 'behavior', value: sequence.behavior }
    ].filter(item => item.value && item.value.toLowerCase() !== 'null' && item.value.trim() !== '');

    for (let i = 0; i < items.length - 1; i++) {
      const sourceKey = `${items[i].category}:${items[i].value}`;
      const targetKey = `${items[i + 1].category}:${items[i + 1].value}`;
      
      // Only count if both nodes are in our filtered set
      if (nodeMap.has(sourceKey) && nodeMap.has(targetKey)) {
        const linkKey = `${sourceKey}->${targetKey}`;
        linkMap.set(linkKey, (linkMap.get(linkKey) || 0) + 1);
      }
    }
  });

  // Create links array
  const links: SankeyLink[] = Array.from(linkMap.entries()).map(([linkKey, value]) => {
    const [sourceKey, targetKey] = linkKey.split('->');
    const sourceIndex = nodeMap.get(sourceKey)!;
    const targetIndex = nodeMap.get(targetKey)!;
    return {
      source: sourceIndex,
      target: targetIndex,
      value
    };
  });

  return { nodes, links };
};

// Custom Sankey component with improved visuals
const CustomSankey = ({ data }: { data: { nodes: SankeyNode[]; links: SankeyLink[] } }) => {
  const { nodes, links } = data;
  const categories = ['circumstance', 'trigger', 'emotion', 'thought', 'behavior'];
  
  // Group nodes by category for positioning
  const nodesByCategory = categories.map(category => 
    nodes.filter(node => node.category === category)
  );

  const columnWidth = 160;
  const nodeHeight = 40;
  const nodeSpacing = 15;
  const svgWidth = categories.length * columnWidth + 80;
  
  // Position nodes with better spacing
  const positionedNodes = nodesByCategory.map((categoryNodes, categoryIndex) => {
    const totalHeight = categoryNodes.length * (nodeHeight + nodeSpacing) - nodeSpacing;
    const startY = Math.max(100, (400 - totalHeight) / 2);
    
    return categoryNodes.map((node, nodeIndex) => ({
      ...node,
      index: nodes.indexOf(node),
      x: categoryIndex * columnWidth + 40,
      y: startY + nodeIndex * (nodeHeight + nodeSpacing),
      width: columnWidth - 50,
      height: nodeHeight
    }));
  }).flat();

  const maxY = Math.max(...positionedNodes.map(n => n.y + n.height));
  const svgHeight = Math.max(maxY + 80, 450);

  return (
    <div className="w-full overflow-x-auto bg-background rounded-lg">
      <svg width={svgWidth} height={svgHeight} className="bg-background">
        {/* Background gradient */}
        <defs>
          <linearGradient id="linkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Draw flowing links */}
        {links.map((link, index) => {
          const sourceNode = positionedNodes.find(n => n.index === link.source);
          const targetNode = positionedNodes.find(n => n.index === link.target);
          
          if (!sourceNode || !targetNode) return null;

          const x1 = sourceNode.x + sourceNode.width;
          const y1 = sourceNode.y + sourceNode.height / 2;
          const x2 = targetNode.x;
          const y2 = targetNode.y + targetNode.height / 2;
          
          const strokeWidth = Math.max(4, Math.min(30, link.value * 6));
          const controlPointOffset = (x2 - x1) * 0.6;
          
          return (
            <path
              key={index}
              d={`M ${x1} ${y1} C ${x1 + controlPointOffset} ${y1} ${x2 - controlPointOffset} ${y2} ${x2} ${y2}`}
              stroke="url(#linkGradient)"
              strokeWidth={strokeWidth}
              fill="none"
              className="hover:opacity-80 transition-opacity duration-200"
            />
          );
        })}

        {/* Draw nodes with improved styling and tooltips */}
        {positionedNodes.map((node) => {
          const categoryIndex = categories.indexOf(node.category);
          const color = CATEGORY_COLORS[categoryIndex];
          
          return (
            <g key={node.index} className="hover:opacity-90 transition-opacity duration-200">
              <rect
                x={node.x}
                y={node.y}
                width={node.width}
                height={node.height}
                fill={color}
                rx={12}
                className="drop-shadow-sm"
              >
                <title>{node.fullName || node.name}</title>
              </rect>
              <text
                x={node.x + node.width / 2}
                y={node.y + node.height / 2 + 2}
                textAnchor="middle"
                className="text-xs font-semibold fill-white pointer-events-none"
              >
                {node.name}
                <title>{node.fullName || node.name}</title>
              </text>
            </g>
          );
        })}

        {/* Category headers with better positioning */}
        {categories.map((category, index) => (
          <text
            key={category}
            x={index * columnWidth + 40 + (columnWidth - 50) / 2}
            y={35}
            textAnchor="middle"
            className="text-sm font-bold fill-foreground capitalize tracking-wide"
          >
            {category}
          </text>
        ))}
      </svg>
    </div>
  );
};

export function RelapseSequenceChart({ data, loading, error }: RelapseSequenceChartProps) {
  const sankeyData = useMemo(() => data ? transformToSankeyData(data) : { nodes: [], links: [] }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relapse Sequence Flow</CardTitle>
        <p className="text-sm text-muted-foreground">
          Clinical Question: What's the most common psychological pathway leading to relapse?<br />
          Flow from circumstances through triggers, emotions, thoughts to behaviors
        </p>
        <div className="flex items-center space-x-4 text-xs mt-2">
          {['circumstance', 'trigger', 'emotion', 'thought', 'behavior'].map((category, index) => (
            <div key={category} className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[index] }}></div>
              <span className="capitalize">{category}</span>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 mb-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Loading relapse sequence data...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-destructive">{error}</p>
            </div>
          ) : sankeyData.nodes.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No relapse sequence data available</p>
            </div>
          ) : (
            <CustomSankey data={sankeyData} />
          )}
        </div>
        {sankeyData.nodes.length > 0 && (
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Why it matters:</strong> Understanding the sequential patterns from circumstances to behaviors 
              helps identify intervention points. Thicker flows indicate more common pathways that require targeted 
              therapeutic focus.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
