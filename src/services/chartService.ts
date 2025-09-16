import { apiClient } from "./apiClient";
import { ApiMoodChartResponse, ApiTriggerChartResponse, ApiMealChartResponse, ApiCognitiveDistortionResponse, ApiRelapseSequenceResponse, ApiRelapseResponseResponse } from "@/types/chart";

export async function fetchMoodChartData(userId: number, days: number = 30): Promise<ApiMoodChartResponse> {
  try {
    const chartData: ApiMoodChartResponse = await apiClient.fetchMoodChartData(userId, { days });
    return chartData;
  } catch (error) {
    throw new Error(`Failed to fetch mood chart data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function fetchTriggerChartData(userId: number, days: number = 30): Promise<ApiTriggerChartResponse> {
  try {
    const chartData = await apiClient.fetchTriggerChartData(userId, { days });
    return chartData;
  } catch (error) {
    throw new Error(`Failed to fetch trigger chart data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function fetchMealChartData(userId: number): Promise<ApiMealChartResponse> {
  try {
    const chartData = await apiClient.fetchMealChartData(userId);
    return chartData;
  } catch (error) {
    throw new Error(`Failed to fetch meal chart data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function fetchCognitiveDistortionData(userId: number, days?: number): Promise<ApiCognitiveDistortionResponse[]> {
  try {
    const chartData = await apiClient.fetchCognitiveDistortionData(userId, { days });
    return chartData;
  } catch (error) {
    throw new Error(`Failed to fetch cognitive distortion data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function fetchRelapseSequenceData(userId: number, days?: number): Promise<ApiRelapseSequenceResponse[]> {
  try {
    const chartData = await apiClient.fetchRelapseSequenceData(userId, { days });
    return chartData;
  } catch (error) {
    throw new Error(`Failed to fetch relapse sequence data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function fetchRelapseResponseData(userId: number): Promise<ApiRelapseResponseResponse[]> {
  try {
    const chartData = await apiClient.fetchRelapseResponseData(userId);
    return chartData;
  } catch (error) {
    throw new Error(`Failed to fetch relapse response data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}