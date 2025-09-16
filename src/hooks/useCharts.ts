import { useState, useCallback } from 'react';
import { ApiMoodChartResponse, ApiTriggerChartResponse, ApiMealChartResponse, ApiCognitiveDistortionResponse, ApiRelapseSequenceResponse, ApiRelapseResponseResponse } from '@/types/chart';
import { fetchMoodChartData, fetchTriggerChartData, fetchMealChartData, fetchCognitiveDistortionData, fetchRelapseSequenceData, fetchRelapseResponseData } from '@/services/chartService';

export function useCharts() {
  const [moodData, setMoodData] = useState<ApiMoodChartResponse | null>(null);
  const [triggerData, setTriggerData] = useState<ApiTriggerChartResponse | null>(null);
  const [mealData, setMealData] = useState<ApiMealChartResponse | null>(null);
  const [cognitiveDistortionData, setCognitiveDistortionData] = useState<ApiCognitiveDistortionResponse[] | null>(null);
  const [relapseSequenceData, setRelapseSequenceData] = useState<ApiRelapseSequenceResponse[] | null>(null);
  const [relapseResponseData, setRelapseResponseData] = useState<ApiRelapseResponseResponse[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMoodData = useCallback(async (userId: number, days: number = 30) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMoodChartData(userId, days);
      setMoodData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch mood chart data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTriggerData = useCallback(async (userId: number, days: number = 30) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTriggerChartData(userId, days);
      setTriggerData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trigger chart data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMealData = useCallback(async (userId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMealChartData(userId);
      setMealData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch meal chart data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCognitiveDistortionChartData = useCallback(async (userId: number, days?: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCognitiveDistortionData(userId, days);
      setCognitiveDistortionData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cognitive distortion data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRelapseSequenceChartData = useCallback(async (userId: number, days?: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRelapseSequenceData(userId, days);
      setRelapseSequenceData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch relapse sequence data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRelapseResponseChartData = useCallback(async (userId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRelapseResponseData(userId);
      setRelapseResponseData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch relapse response data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllChartData = useCallback(async (userId: number, days: number = 30) => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([
        fetchMoodData(userId, days),
        fetchTriggerData(userId, days),
        fetchMealData(userId),
        fetchCognitiveDistortionChartData(userId, days),
        fetchRelapseSequenceChartData(userId, days),
        fetchRelapseResponseChartData(userId)
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch chart data');
    } finally {
      setLoading(false);
    }
  }, [fetchMoodData, fetchTriggerData, fetchMealData, fetchCognitiveDistortionChartData, fetchRelapseSequenceChartData, fetchRelapseResponseChartData]);

  return { 
    moodData, 
    triggerData, 
    mealData,
    cognitiveDistortionData,
    relapseSequenceData,
    relapseResponseData,
    loading, 
    error, 
    fetchMoodData, 
    fetchTriggerData,
    fetchMealData,
    fetchCognitiveDistortionChartData,
    fetchRelapseSequenceChartData,
    fetchRelapseResponseChartData,
    fetchAllChartData 
  };
}
