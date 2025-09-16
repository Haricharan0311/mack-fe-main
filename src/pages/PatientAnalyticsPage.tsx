import { Layout } from '@/components/layout/Layout';
import { MoodChart } from '@/components/charts/MoodChart';
import { TriggerChart } from '@/components/charts/TriggerChart';
import { MealChart } from '@/components/charts/MealChart';
import { CognitiveDistortionChart } from '@/components/charts/CognitiveDistortionChart';
import { RelapseSequenceChart } from '@/components/charts/RelapseSequenceChart';
import { RelapseResponseChart } from '@/components/charts/RelapseResponseChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Calendar, Flag } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePatient } from '@/hooks/usePatients';
import { useCharts } from '@/hooks/useCharts';
import { useState, useEffect } from 'react';

export default function PatientAnalyticsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedDays, setSelectedDays] = useState(30);

  const { patient, loading, error } = usePatient(id ? parseInt(id) : undefined);
  const { 
    moodData, 
    triggerData, 
    mealData,
    cognitiveDistortionData,
    relapseSequenceData,
    relapseResponseData,
    loading: chartLoading, 
    error: chartError, 
    fetchAllChartData 
  } = useCharts();
  
  useEffect(() => {
    if (patient?.id) {
      fetchAllChartData(patient.id, selectedDays);
    }
  }, [patient?.id, selectedDays, fetchAllChartData]);
  
  const handleDaysChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDays(parseInt(event.target.value));
  };
  
  console.log('Patient Analytics Page - Patient:', patient);
  console.log('Patient Analytics Page - Mood Data:', moodData);
  console.log('Patient Analytics Page - Trigger Data:', triggerData);


  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary">
                {patient?.first_name && patient?.last_name 
                  ? `${patient.first_name[0]}${patient.last_name[0]}`
                  : ''}
              </AvatarFallback>
            </Avatar>
            <div>
              {patient?.first_name && patient?.last_name 
                ? `${patient.first_name} ${patient.last_name}`
                : 'Patient'}
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>{patient?.condition || 'N/A'}</span>
                <span>•</span>
                <span>Treatment started {patient?.created_at ? new Date(patient.created_at).toLocaleDateString() : ''}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <select 
                className="bg-background border border-border rounded-md px-3 py-1 text-sm"
                value={selectedDays}
                onChange={handleDaysChange}
              >
                <option value={30}>Last 30 days</option>
                <option value={60}>Last 60 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              Export
            </Button>
            <Button variant="secondary" className="bg-warning text-warning-foreground hover:bg-warning/90">
              <Flag className="w-4 h-4 mr-2" />
              Flag for Review
            </Button>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MoodChart data={moodData} loading={chartLoading} error={chartError} />
          <TriggerChart data={triggerData} loading={chartLoading} error={chartError} />
        </div>

        {/* Additional Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MealChart data={mealData} loading={chartLoading} error={chartError} />
          <CognitiveDistortionChart data={cognitiveDistortionData} loading={chartLoading} error={chartError} />
        </div>

        {/* Bottom Row - Relapse Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RelapseResponseChart data={relapseResponseData} loading={chartLoading} error={chartError} />
          <RelapseSequenceChart data={relapseSequenceData} loading={chartLoading} error={chartError} />
        </div>
      </div>
    </Layout>
  );
}