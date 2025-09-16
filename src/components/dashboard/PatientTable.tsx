import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Search, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { usePatients } from '@/hooks/usePatients';
import { ApiPatientResponse } from '@/types/patient';

function getRiskBadgeVariant(risk: ApiPatientResponse['risk_level']) {
  switch (risk) {
    case 'high': return 'destructive';
    case 'medium': return 'secondary';
    case 'low': return 'default';
  }
}

function MoodSparkline({ trend }: { trend: ApiPatientResponse['moodTrend'] }) {
  const getColor = () => {
    switch (trend) {
      case 'up': return 'text-success';
      case 'down': return 'text-destructive';
      case 'stable': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className={cn('w-16 h-8 flex items-center justify-center', getColor())}>
      <svg width="48" height="24" viewBox="0 0 48 24" className="stroke-current">
        {trend === 'up' && (
          <path d="M2 20 L12 16 L22 12 L32 8 L42 4" strokeWidth="2" fill="none" />
        )}
        {trend === 'down' && (
          <path d="M2 4 L12 8 L22 12 L32 16 L42 20" strokeWidth="2" fill="none" />
        )}
        {trend === 'stable' && (
          <path d="M2 12 L12 10 L22 14 L32 11 L42 13" strokeWidth="2" fill="none" />
        )}
      </svg>
    </div>
  );
}

export function PatientTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { patients, loading, error } = usePatients();

  const filteredPatients = patients.filter(patient =>
    `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePatientClick = (patientId: number) => {
    navigate(`/patients/${patientId}`);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <p>Loading patients...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-destructive">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Patient Overview</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient Name</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead>Last Session</TableHead>
              <TableHead>Next Session</TableHead>
              <TableHead>Mood Trend</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow 
                key={patient.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handlePatientClick(patient.id)}
              >
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {patient.first_name[0]}{patient.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">
                        {patient.first_name} {patient.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">{patient.condition}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getRiskBadgeVariant(patient.risk_level)}>
                    {patient.risk_level.charAt(0).toUpperCase() + patient.risk_level.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {patient.last_session ? new Date(patient.last_session).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {patient.next_session ? new Date(patient.next_session).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>
                  <MoodSparkline trend={patient.moodTrend} />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}