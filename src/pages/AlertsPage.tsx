import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock } from 'lucide-react';

interface Alert {
  id: number;
  patientName: string;
  riskLevel: 'High' | 'Medium';
  alertType: string;
  description: string;
  timestamp: string;
  urgent: boolean;
}

const mockAlerts: Alert[] = [
  {
    id: 1,
    patientName: 'Sarah Johnson',
    riskLevel: 'High',
    alertType: 'Mood Decline',
    description: 'Significant drop in mood scores over the past 3 days',
    timestamp: '2 hours ago',
    urgent: true
  },
  {
    id: 2,
    patientName: 'Michael Chen',
    riskLevel: 'High',
    alertType: 'Missed Sessions',
    description: 'Patient has missed 2 consecutive appointments',
    timestamp: '4 hours ago',
    urgent: true
  },
  {
    id: 3,
    patientName: 'Olivia Wilson',
    riskLevel: 'High',
    alertType: 'Trigger Frequency',
    description: 'Increased frequency of eating disorder triggers',
    timestamp: '6 hours ago',
    urgent: false
  },
  {
    id: 4,
    patientName: 'Emily Rodriguez',
    riskLevel: 'Medium',
    alertType: 'Sleep Pattern',
    description: 'Irregular sleep patterns detected',
    timestamp: '1 day ago',
    urgent: false
  }
];

export default function AlertsPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Alerts</h1>
          <p className="text-muted-foreground">Monitor high-risk patients and urgent notifications</p>
        </div>

        <div className="grid gap-4">
          {mockAlerts.map((alert) => (
            <Card key={alert.id} className={alert.urgent ? 'border-destructive/50 bg-destructive/5' : ''}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${alert.urgent ? 'bg-destructive/10' : 'bg-warning/10'}`}>
                      <AlertTriangle className={`w-5 h-5 ${alert.urgent ? 'text-destructive' : 'text-warning'}`} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {alert.patientName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-foreground">{alert.patientName}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant={alert.riskLevel === 'High' ? 'destructive' : 'secondary'}>
                              {alert.riskLevel} Risk
                            </Badge>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm font-medium text-foreground">{alert.alertType}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{alert.description}</p>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{alert.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      View Patient
                    </Button>
                    <Button variant={alert.urgent ? 'default' : 'secondary'} size="sm">
                      {alert.urgent ? 'Address Now' : 'Review'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}