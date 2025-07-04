export const testCases = [
  // Cross-domain insight tests
  {
    id: "cross_domain_1",
    category: "cross_domain_insights",
    prompt:
      "I had a hard workout yesterday and my sleep was terrible. What happened?",
    expectedBehaviors: [
      "references_specific_workout_data",
      "references_specific_sleep_metrics",
      "provides_cross_domain_insight",
      "avoids_obvious_statements",
      "uses_recent_data_5_7_days",
    ],
    mockDataFiles: ["activity_data.json", "sleep_data.json", "hrv_data.json"],
    expectedFunctionCalls: [],
    priority: "high",
  },

  // Nutrition logging tests
  {
    id: "nutrition_1",
    category: "nutrition_logging",
    prompt:
      "I had 2 scrambled eggs, 1 slice of sourdough bread, and a cappuccino for breakfast",
    expectedBehaviors: [
      "calls_nutrition_function",
      "combines_multiple_foods_single_call",
      "provides_fun_fact",
      "confirms_logging",
    ],
    mockDataFiles: [],
    expectedFunctionCalls: ["get_nutrition_from_image"],
    priority: "high",
  },

  // Preference logging tests
  {
    id: "preference_1",
    category: "preference_logging",
    prompt:
      "I'm vegetarian and allergic to nuts. I also prefer working out in the morning.",
    expectedBehaviors: [
      "calls_preference_function",
      "handles_multiple_preferences",
      "categorizes_correctly",
      "uses_array_format",
    ],
    mockDataFiles: [],
    expectedFunctionCalls: ["log_preference"],
    priority: "high",
  },

  // Data interpretation tests
  {
    id: "interpretation_1",
    category: "data_interpretation",
    prompt: "How has my HRV been trending this week?",
    expectedBehaviors: [
      "uses_hrv_data_file",
      "analyzes_5_7_day_trend",
      "provides_specific_values",
      "avoids_generic_advice",
      "connects_to_other_domains",
    ],
    mockDataFiles: ["hrv_data.json", "sleep_data.json", "activity_data.json"],
    expectedFunctionCalls: [],
    priority: "medium",
  },

  // Edge cases
  {
    id: "edge_1",
    category: "edge_cases",
    prompt: "Tell me about my sleep",
    expectedBehaviors: [
      "requests_specific_data",
      "avoids_generic_summaries",
      "provides_meaningful_insight_or_explains_limitation",
    ],
    mockDataFiles: ["sleep_data.json"],
    expectedFunctionCalls: [],
    priority: "medium",
  },
];

export const evaluationCriteria = {
  cross_domain_insights: {
    weight: 0.3,
    metrics: [
      "references_multiple_domains",
      "provides_non_obvious_insight",
      "uses_specific_data_values",
      "avoids_summarizing_charts",
      "mobile_friendly_length",
    ],
  },
  nutrition_logging: {
    weight: 0.25,
    metrics: [
      "correct_function_call",
      "accurate_food_parsing",
      "appropriate_confirmation",
      "includes_fun_fact",
      "handles_multiple_items",
    ],
  },
  preference_logging: {
    weight: 0.2,
    metrics: [
      "correct_function_call",
      "proper_categorization",
      "array_format_for_multiple",
      "confidence_assessment",
      "stateless_behavior",
    ],
  },
  data_interpretation: {
    weight: 0.15,
    metrics: [
      "uses_correct_data_files",
      "provides_specific_values",
      "appropriate_timeframe",
      "meaningful_analysis",
      "avoids_hallucination",
    ],
  },
  tone_and_format: {
    weight: 0.1,
    metrics: [
      "sharp_concise_tone",
      "avoids_hedging",
      "mobile_appropriate_length",
      "no_filler_phrases",
      "authoritative_when_supported",
    ],
  },
};
