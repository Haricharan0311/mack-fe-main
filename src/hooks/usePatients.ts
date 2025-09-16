import { useState, useEffect, useCallback } from 'react';
import { ApiPatientResponse } from '@/types/patient';
import { fetchPatient, fetchPatients } from '@/services/patientService';
import { useAuth } from '@/components/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';

export function usePatients() {
  const [patients, setPatients] = useState<ApiPatientResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();
  const navigate = useNavigate();

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const patientsData = await fetchPatients();
      setPatients(patientsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadPatients();
    } else {
      setLoading(false);
      setError('Authentication required');
    }
  }, [session]);

  const handlePatientClick = (patientId: number) => {
    navigate(`/patients/${patientId}`);
  };

  return { patients, loading, error, refetch: loadPatients, handlePatientClick };
}

export function usePatient(id?: number) {
  const [patient, setPatient] = useState<ApiPatientResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatientById = useCallback(async (patientId: number) => {
    try {
      setLoading(true);
      setError(null);
      const patientData = await fetchPatient(patientId);
      setPatient(patientData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch patient');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchPatientById(id);
    }
  }, [id, fetchPatientById]);

  return { patient, loading, error, fetchPatientById };
}
