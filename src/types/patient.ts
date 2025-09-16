export interface ApiPatientResponse {
  id: number;
  created_at: string;
  therapist_user_id: string;
  first_name: string;
  last_name: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  risk_level: 'high' | 'medium' | 'low';
  condition: string | null;
  last_session: string | null;
  next_session: string | null;
  moodTrend?: 'up' | 'down' | 'stable';
}
