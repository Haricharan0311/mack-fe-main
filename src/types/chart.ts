export type ApiMoodChartResponse = {
    dates: string[];
    valenceScores: number[];
    emotions: string[];
    movingAverage: number[];
};

export type ApiTriggerChartResponse = {
    days: string[];
    triggersByDay: {
        Sunday?: { [trigger: string]: number };
        Monday?: { [trigger: string]: number };
        Tuesday?: { [trigger: string]: number };
        Wednesday?: { [trigger: string]: number };
        Thursday?: { [trigger: string]: number };
        Friday?: { [trigger: string]: number };
        Saturday?: { [trigger: string]: number };
    };
};

export interface ApiMealChartResponse {
    dateLabels: {
        date: string;
        dayOfWeek: string;
        label: string;
    }[];
    mealTypes: string[];
    grid: {
        mealType: string;
        [date: string]: {
            level: string;
            color: string;
        } | string;
    }[];
    colorLegend: {
        [color: string]: string;
    };
    debug?: {
        totalMealRecords: number;
        processedMeals: number;
        dateRange: string;
    };
}

export interface ApiCognitiveDistortionResponse {
  created_at: string;
  distortion_type: string;
  voice_note_excerpt: string;
}

export interface ApiRelapseSequenceResponse {
  analysis_date: string;
  circumstance: string;
  trigger: string;
  emotion: string;
  thought: string;
  behavior: string;
}

export interface ApiRelapseResponseResponse {
  created_at: string;
  body_image: number;
  social_stress: number;
  shame: number;
  comparison: number;
  anxiety_fear: number;
  perfectionism: number;
  loss_of_control: number;
  loneliness: number;
  category: string;
  report_period: string;
}