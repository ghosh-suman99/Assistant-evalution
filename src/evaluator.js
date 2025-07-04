import OpenAIClient from "./openai-client.js";
import { testCases } from "./test-cases.js";
import MockDataGenerator from "./mock-data-generator.js";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

class AssistantEvaluator {
  constructor() {
    this.client = new OpenAIClient();
    this.mockDataGenerator = new MockDataGenerator();
    this.results = [];
  }

  async runEvaluation() {
    console.log(chalk.blue("🚀 Starting Ottavia Assistant Evaluation"));

    // Generate mock data
    await this.mockDataGenerator.generateMockData();

    // Run test cases
    for (const testCase of testCases) {
      console.log(chalk.yellow(`\n📝 Running test: ${testCase.id}`));

      try {
        const result = await this.evaluateTestCase(testCase);
        this.results.push(result);

        const score = this.calculateScore(result);
        const status =
          score >= 0.7 ? chalk.green("✅ PASS") : chalk.red("❌ FAIL");
        console.log(`${status} Score: ${(score * 100).toFixed(1)}%`);

        // Show brief feedback
        if (
          result.evaluation &&
          result.evaluation.feedback &&
          result.evaluation.feedback.length > 0
        ) {
          console.log(
            chalk.gray(
              `   Feedback: ${result.evaluation.feedback
                .slice(0, 2)
                .join(", ")}`
            )
          );
        }
      } catch (error) {
        console.error(
          chalk.red(`❌ Error in test ${testCase.id}:`),
          error.message
        );
        this.results.push({
          testId: testCase.id,
          success: false,
          error: error.message,
          score: 0,
          evaluation: { feedback: [`Error: ${error.message}`] }, // Add default evaluation
        });
      }
    }

    // Generate report
    await this.generateReport();
    console.log(chalk.green("\n🎉 Evaluation completed!"));
  }

  async evaluateTestCase(testCase) {
    // Create new thread
    const threadId = await this.client.createThread();

    // Upload mock data files if needed
    const fileIds = [];
    for (const fileName of testCase.mockDataFiles || []) {
      const filePath = path.join("./data/mock-health-data/", fileName);
      if (await fs.pathExists(filePath)) {
        const fileId = await this.client.uploadFile(filePath);
        if (fileId) {
          fileIds.push(fileId);
        }
      }
    }

    // Add message and run assistant
    await this.client.addMessage(threadId, testCase.prompt, fileIds);
    const response = await this.client.runAssistant(threadId);

    // Evaluate response
    const evaluation = this.evaluateResponse(testCase, response);

    return {
      testId: testCase.id,
      category: testCase.category,
      prompt: testCase.prompt,
      response: response.response || "No response",
      functionCalls: response.functionCalls || [],
      evaluation: evaluation,
      success: response.success,
      timestamp: new Date().toISOString(),
    };
  }

  evaluateResponse(testCase, response) {
    const evaluation = {
      behaviorScores: {},
      functionCallScore: 0,
      overallScore: 0,
      feedback: [],
    };

    if (!response.success) {
      evaluation.feedback.push("Assistant failed to respond");
      return evaluation;
    }

    // Evaluate expected behaviors
    for (const behavior of testCase.expectedBehaviors) {
      const score = this.evaluateBehavior(
        behavior,
        response.response || "",
        response.functionCalls || []
      );
      evaluation.behaviorScores[behavior] = score;

      if (score < 0.5) {
        evaluation.feedback.push(`Failed behavior: ${behavior}`);
      }
    }

    // Evaluate function calls
    if (testCase.expectedFunctionCalls.length > 0) {
      evaluation.functionCallScore = this.evaluateFunctionCalls(
        testCase.expectedFunctionCalls,
        response.functionCalls || []
      );

      if (evaluation.functionCallScore < 0.5) {
        evaluation.feedback.push("Incorrect or missing function calls");
      }
    } else {
      evaluation.functionCallScore = 1; // No function calls expected
    }

    // Calculate overall score
    const behaviorScores = Object.values(evaluation.behaviorScores);
    const avgBehaviorScore =
      behaviorScores.length > 0
        ? behaviorScores.reduce((a, b) => a + b, 0) / behaviorScores.length
        : 0;

    evaluation.overallScore =
      (avgBehaviorScore + evaluation.functionCallScore) / 2;

    return evaluation;
  }

  evaluateBehavior(behavior, responseText, functionCalls) {
    const text = responseText.toLowerCase();

    switch (behavior) {
      case "references_specific_workout_data":
        return this.containsWorkoutMetrics(text) ? 1 : 0;

      case "references_specific_sleep_metrics":
        return this.containsSleepMetrics(text) ? 1 : 0;

      case "provides_cross_domain_insight":
        return this.containsCrossDomainInsight(text) ? 1 : 0;

      case "avoids_obvious_statements":
        return this.avoidsObviousStatements(text) ? 1 : 0;

      case "calls_nutrition_function":
        return functionCalls.some(
          (call) => call.name === "get_nutrition_from_image"
        )
          ? 1
          : 0;

      case "calls_preference_function":
        return functionCalls.some((call) => call.name === "log_preference")
          ? 1
          : 0;

      case "combines_multiple_foods_single_call":
        const nutritionCalls = functionCalls.filter(
          (call) => call.name === "get_nutrition_from_image"
        );
        return nutritionCalls.length === 1 ? 1 : 0;

      case "provides_fun_fact":
        return this.containsFunFact(text) ? 1 : 0;

      case "mobile_friendly_length":
        return responseText.length <= 500
          ? 1
          : Math.max(0, 1 - (responseText.length - 500) / 500);

      case "uses_recent_data_5_7_days":
        const timeTerms = [
          "recent",
          "last week",
          "past week",
          "5 days",
          "7 days",
          "this week",
        ];
        return timeTerms.some((term) => text.includes(term)) ? 1 : 0;

      case "confirms_logging":
        const confirmTerms = ["added", "logged", "recorded", "saved"];
        return confirmTerms.some((term) => text.includes(term)) ? 1 : 0;

      case "handles_multiple_preferences":
        const prefCalls = functionCalls.filter(
          (call) => call.name === "log_preference"
        );
        if (prefCalls.length > 0) {
          try {
            const args = prefCalls[0].arguments;
            return args.preferences && args.preferences.length >= 2 ? 1 : 0;
          } catch {
            return 0;
          }
        }
        return 0;

      case "categorizes_correctly":
        // Check if preference function call has proper categories
        const prefCallsWithCategories = functionCalls.filter(
          (call) => call.name === "log_preference"
        );
        if (prefCallsWithCategories.length > 0) {
          try {
            const args = prefCallsWithCategories[0].arguments;
            const validCategories = [
              "nutrition",
              "activity",
              "medical",
              "schedule",
              "preference",
            ];
            if (args.preferences) {
              return args.preferences.some((pref) =>
                validCategories.includes(pref.category)
              )
                ? 1
                : 0;
            }
          } catch {
            return 0;
          }
        }
        return 0;

      case "uses_array_format":
        const arrayFormatCalls = functionCalls.filter(
          (call) => call.name === "log_preference"
        );
        if (arrayFormatCalls.length > 0) {
          try {
            const args = arrayFormatCalls[0].arguments;
            return Array.isArray(args.preferences) ? 1 : 0;
          } catch {
            return 0;
          }
        }
        return 0;

      default:
        return 0.5; // Default score for unimplemented behaviors
    }
  }

  containsWorkoutMetrics(text) {
    const workoutTerms = [
      "duration",
      "distance",
      "heart rate",
      "calories",
      "training load",
      "elevation",
    ];
    return workoutTerms.some((term) => text.includes(term));
  }

  containsSleepMetrics(text) {
    const sleepTerms = [
      "deep sleep",
      "rem",
      "light sleep",
      "sleep quality",
      "hrv",
      "restless",
    ];
    return sleepTerms.some((term) => text.includes(term));
  }

  containsCrossDomainInsight(text) {
    const domains = [
      "sleep",
      "stress",
      "training",
      "nutrition",
      "hrv",
      "recovery",
    ];
    const mentionedDomains = domains.filter((domain) => text.includes(domain));
    return mentionedDomains.length >= 2;
  }

  avoidsObviousStatements(text) {
    const obviousPatterns = [
      "bad sleep makes you tired",
      "exercise is good for you",
      "you should get more sleep",
      "hard workout can affect sleep",
    ];
    return !obviousPatterns.some((pattern) => text.includes(pattern));
  }

  containsFunFact(text) {
    const funFactIndicators = [
      "ancient",
      "originally",
      "historically",
      "studies show",
      "research",
      "fun fact",
    ];
    return funFactIndicators.some((indicator) => text.includes(indicator));
  }

  evaluateFunctionCalls(expected, actual) {
    if (expected.length === 0 && actual.length === 0) return 1;
    if (expected.length === 0) return actual.length === 0 ? 1 : 0;

    let score = 0;
    for (const expectedCall of expected) {
      const found = actual.find((call) => call.name === expectedCall);
      if (found) score += 1;
    }

    return score / expected.length;
  }

  calculateScore(result) {
    if (!result.success) return 0;
    if (!result.evaluation) return 0;
    return result.evaluation.overallScore || 0;
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: this.generateSummary(),
      results: this.results,
      recommendations: this.generateRecommendations(),
    };

    await fs.ensureDir("./reports");
    const reportPath = `./reports/evaluation-${Date.now()}.json`;
    await fs.writeJson(reportPath, report, { spaces: 2 });

    console.log(chalk.blue(`📊 Report saved to: ${reportPath}`));
    this.printSummary(report.summary);
  }

  generateSummary() {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(
      (r) => this.calculateScore(r) >= 0.7
    ).length;
    const avgScore =
      this.results.reduce((sum, r) => sum + this.calculateScore(r), 0) /
      totalTests;

    const categoryScores = {};
    for (const result of this.results) {
      if (!categoryScores[result.category]) {
        categoryScores[result.category] = [];
      }
      categoryScores[result.category].push(this.calculateScore(result));
    }

    for (const category in categoryScores) {
      const scores = categoryScores[category];
      categoryScores[category] =
        scores.reduce((a, b) => a + b, 0) / scores.length;
    }

    return {
      totalTests,
      passedTests,
      passRate: passedTests / totalTests,
      avgScore,
      categoryScores,
    };
  }

  generateRecommendations() {
    const recommendations = [];
    const failedTests = this.results.filter(
      (r) => this.calculateScore(r) < 0.7
    );

    if (failedTests.length > 0) {
      recommendations.push(
        "Review failed test cases and improve system instructions"
      );
    }

    // Add specific recommendations based on common failures
    const commonFailures = {};
    for (const test of failedTests) {
      // Safely access feedback array
      const feedback = test.evaluation?.feedback || [];
      for (const feedbackItem of feedback) {
        commonFailures[feedbackItem] = (commonFailures[feedbackItem] || 0) + 1;
      }
    }

    for (const [failure, count] of Object.entries(commonFailures)) {
      if (count >= 2) {
        recommendations.push(
          `Address common issue: ${failure} (${count} occurrences)`
        );
      }
    }

    return recommendations;
  }

  printSummary(summary) {
    console.log(chalk.blue("\n📊 EVALUATION SUMMARY"));
    console.log(chalk.white(`Total Tests: ${summary.totalTests}`));
    console.log(chalk.white(`Passed: ${summary.passedTests}`));
    console.log(
      chalk.white(`Pass Rate: ${(summary.passRate * 100).toFixed(1)}%`)
    );
    console.log(
      chalk.white(`Average Score: ${(summary.avgScore * 100).toFixed(1)}%`)
    );

    console.log(chalk.blue("\n📈 CATEGORY SCORES"));
    for (const [category, score] of Object.entries(summary.categoryScores)) {
      const color = score >= 0.7 ? chalk.green : chalk.red;
      console.log(color(`${category}: ${(score * 100).toFixed(1)}%`));
    }
  }
}

export default AssistantEvaluator;
