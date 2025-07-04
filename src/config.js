import dotenv from "dotenv";
dotenv.config();

export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    assistantId: process.env.ASSISTANT_ID, // Your Ottavia assistant ID
    model: "gpt-4o",
  },
  evaluation: {
    maxRetries: 3,
    timeoutMs: 30000,
    batchSize: 5,
  },
  paths: {
    testCases: "./data/test-cases.json",
    mockData: "./data/mock-health-data/",
    results: "./results/",
    reports: "./reports/",
  },
};
