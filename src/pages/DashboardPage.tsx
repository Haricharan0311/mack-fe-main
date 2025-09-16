import { Layout } from '@/components/layout/Layout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { PatientTable } from '@/components/dashboard/PatientTable';
import { Users, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.display_name || user?.email || 'Unknown User';
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Good morning, Dr. {displayName}</h1>
          <p className="text-muted-foreground">Here's your patient overview for today • {currentDate}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Active Patients"
            value={42}
            change={{ value: '+3 from last week', type: 'increase' }}
            icon={Users}
          />
          <StatsCard
            title="High-Risk Flags"
            value={7}
            change={{ value: '+2 from last week', type: 'increase' }}
            icon={AlertTriangle}
            variant="warning"
          />
          <StatsCard
            title="Avg. Risk Score"
            value={3.8}
            change={{ value: '-0.5 from last week', type: 'decrease' }}
            icon={TrendingUp}
          />
          <StatsCard
            title="New Relapse Indicators"
            value={5}
            subtitle="Requires immediate attention"
            icon={Activity}
            variant="destructive"
          />
        </div>

        {/* Patient Table */}
        <PatientTable />
      </div>
    </Layout>
  );
}