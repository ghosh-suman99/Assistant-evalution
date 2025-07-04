import { describe, it } from "node:test";
import assert from "node:assert";
import AssistantEvaluator from "../evaluator.js";

describe("AssistantEvaluator", () => {
  let evaluator;

  beforeEach(() => {
    evaluator = new AssistantEvaluator();
  });

  describe("evaluateBehavior", () => {
    it("should detect workout metrics in response", () => {
      const response =
        "Your workout lasted 45 minutes with an average heart rate of 150 bpm";
      const score = evaluator.evaluateBehavior(
        "references_specific_workout_data",
        response,
        []
      );
      assert.strictEqual(score, 1);
    });

    it("should detect sleep metrics in response", () => {
      const response =
        "You had 2 hours of deep sleep and 1.5 hours of REM sleep";
      const score = evaluator.evaluateBehavior(
        "references_specific_sleep_metrics",
        response,
        []
      );
      assert.strictEqual(score, 1);
    });

    it("should detect cross-domain insights", () => {
      const response =
        "Your poor sleep affected your training recovery and increased stress levels";
      const score = evaluator.evaluateBehavior(
        "provides_cross_domain_insight",
        response,
        []
      );
      assert.strictEqual(score, 1);
    });

    it("should penalize obvious statements", () => {
      const response =
        "Bad sleep makes you tired and you should get more sleep";
      const score = evaluator.evaluateBehavior(
        "avoids_obvious_statements",
        response,
        []
      );
      assert.strictEqual(score, 0);
    });

    it("should check mobile-friendly length", () => {
      const shortResponse = "Brief insight about your data.";
      const longResponse = "A".repeat(600); // Too long

      assert.strictEqual(
        evaluator.evaluateBehavior("mobile_friendly_length", shortResponse, []),
        1
      );
      assert.ok(
        evaluator.evaluateBehavior("mobile_friendly_length", longResponse, []) <
          1
      );
    });
  });

  describe("evaluateFunctionCalls", () => {
    it("should score perfect match", () => {
      const expected = ["get_nutrition_from_image"];
      const actual = [{ name: "get_nutrition_from_image", arguments: {} }];
      const score = evaluator.evaluateFunctionCalls(expected, actual);
      assert.strictEqual(score, 1);
    });

    it("should score partial match", () => {
      const expected = ["get_nutrition_from_image", "log_preference"];
      const actual = [{ name: "get_nutrition_from_image", arguments: {} }];
      const score = evaluator.evaluateFunctionCalls(expected, actual);
      assert.strictEqual(score, 0.5);
    });

    it("should score no match", () => {
      const expected = ["get_nutrition_from_image"];
      const actual = [];
      const score = evaluator.evaluateFunctionCalls(expected, actual);
      assert.strictEqual(score, 0);
    });
  });

  describe("utility methods", () => {
    it("should detect workout metrics correctly", () => {
      const textWithMetrics = "duration 45 minutes heart rate 150";
      const textWithoutMetrics = "you had a good workout";

      assert.ok(evaluator.containsWorkoutMetrics(textWithMetrics));
      assert.ok(!evaluator.containsWorkoutMetrics(textWithoutMetrics));
    });

    it("should detect sleep metrics correctly", () => {
      const textWithMetrics = "deep sleep 2 hours rem sleep quality";
      const textWithoutMetrics = "you slept well";

      assert.ok(evaluator.containsSleepMetrics(textWithMetrics));
      assert.ok(!evaluator.containsSleepMetrics(textWithoutMetrics));
    });

    it("should detect cross-domain insights", () => {
      const crossDomainText =
        "sleep affected your training and increased stress";
      const singleDomainText = "you had good sleep";

      assert.ok(evaluator.containsCrossDomainInsight(crossDomainText));
      assert.ok(!evaluator.containsCrossDomainInsight(singleDomainText));
    });
  });
});
