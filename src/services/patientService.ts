import { apiClient } from './apiClient';
import { ApiPatientResponse } from '@/types/patient';

export async function fetchPatients(): Promise<ApiPatientResponse[]> {
  try {
    const apiPatients: ApiPatientResponse[] = await apiClient.getAllPatients();
    return apiPatients;
  } catch (error) {
    throw new Error(`Failed to fetch patients: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function fetchPatient(id: number): Promise<ApiPatientResponse> {
  try {
    const patient: ApiPatientResponse = await apiClient.getPatient(id);
    return patient;
  } catch (error) {
    throw new Error(`Failed to fetch patient: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
