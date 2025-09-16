import { supabase } from '@/integrations/supabase/client';
import { ApiMoodChartResponse, ApiTriggerChartResponse, ApiMealChartResponse, ApiCognitiveDistortionResponse, ApiRelapseSequenceResponse, ApiRelapseResponseResponse } from '@/types/chart';
import { ApiPatientResponse } from '@/types/patient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class ApiClient {
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      throw new Error('Authentication required');
    }

    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Patient endpoints
  async getAllPatients(): Promise<ApiPatientResponse[]> {
    return this.request('/patients/all');
  }

  async getPatient(id: number): Promise<ApiPatientResponse> {
    return this.request(`/patients/${id}`);
  }

  async fetchMoodChartData(userId: number, params: { days: number }): Promise<ApiMoodChartResponse> {
    return this.request(`/charts/mood-fluctuation/${userId}?days=${params.days}`);
  }

  async fetchTriggerChartData(userId: number, params: { days: number }): Promise<ApiTriggerChartResponse> {
    return this.request(`/charts/triggers/${userId}?days=${params.days}`);
  }

  async fetchMealChartData(userId: number): Promise<ApiMealChartResponse> {
    return this.request(`/charts/meals/${userId}`);
  }

  async fetchCognitiveDistortionData(userId: number, params: { days?: number }): Promise<ApiCognitiveDistortionResponse[]> {
    const queryParams = params.days ? `?days=${params.days}` : '';
    return this.request(`/charts/cognitive-distortions/${userId}${queryParams}`);
  }

  async fetchRelapseSequenceData(userId: number, params: { days?: number }): Promise<ApiRelapseSequenceResponse[]> {
    const queryParams = params.days ? `?days=${params.days}` : '';
    return this.request(`/charts/relapse-sequences/${userId}${queryParams}`);
  }

  async fetchRelapseResponseData(userId: number): Promise<ApiRelapseResponseResponse[]> {
    return this.request(`/charts/relapse-response/${userId}`);
  }
}

export const apiClient = new ApiClient();
