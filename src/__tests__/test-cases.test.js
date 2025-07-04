import { describe, it } from "node:test";
import assert from "node:assert";
import { testCases, evaluationCriteria } from "../test-cases.js";

describe("Test Cases Configuration", () => {
  describe("testCases", () => {
    it("should have valid test case structure", () => {
      assert.ok(Array.isArray(testCases));
      assert.ok(testCases.length > 0);

      testCases.forEach((testCase, index) => {
        assert.ok(testCase.id, `Test case ${index} should have an id`);
        assert.ok(
          testCase.category,
          `Test case ${index} should have a category`
        );
        assert.ok(testCase.prompt, `Test case ${index} should have a prompt`);
        assert.ok(
          Array.isArray(testCase.expectedBehaviors),
          `Test case ${index} should have expectedBehaviors array`
        );
        assert.ok(
          Array.isArray(testCase.mockDataFiles),
          `Test case ${index} should have mockDataFiles array`
        );
        assert.ok(
          Array.isArray(testCase.expectedFunctionCalls),
          `Test case ${index} should have expectedFunctionCalls array`
        );
        assert.ok(
          testCase.priority,
          `Test case ${index} should have a priority`
        );
      });
    });

    it("should have unique test case IDs", () => {
      const ids = testCases.map((tc) => tc.id);
      const uniqueIds = [...new Set(ids)];
      assert.strictEqual(
        ids.length,
        uniqueIds.length,
        "All test case IDs should be unique"
      );
    });

    it("should have valid categories", () => {
      const validCategories = [
        "cross_domain_insights",
        "nutrition_logging",
        "preference_logging",
        "data_interpretation",
        "edge_cases",
      ];

      testCases.forEach((testCase) => {
        assert.ok(
          validCategories.includes(testCase.category),
          `Test case ${testCase.id} has invalid category: ${testCase.category}`
        );
      });
    });

    it("should have valid priorities", () => {
      const validPriorities = ["high", "medium", "low"];

      testCases.forEach((testCase) => {
        assert.ok(
          validPriorities.includes(testCase.priority),
          `Test case ${testCase.id} has invalid priority: ${testCase.priority}`
        );
      });
    });
  });

  describe("evaluationCriteria", () => {
    it("should have valid structure", () => {
      assert.ok(typeof evaluationCriteria === "object");

      Object.entries(evaluationCriteria).forEach(([category, criteria]) => {
        assert.ok(
          typeof criteria.weight === "number",
          `${category} should have numeric weight`
        );
        assert.ok(
          criteria.weight > 0 && criteria.weight <= 1,
          `${category} weight should be between 0 and 1`
        );
        assert.ok(
          Array.isArray(criteria.metrics),
          `${category} should have metrics array`
        );
        assert.ok(
          criteria.metrics.length > 0,
          `${category} should have at least one metric`
        );
      });
    });

    it("should have weights that sum to 1", () => {
      const totalWeight = Object.values(evaluationCriteria).reduce(
        (sum, criteria) => sum + criteria.weight,
        0
      );

      // Allow for small floating point errors
      assert.ok(
        Math.abs(totalWeight - 1) < 0.001,
        `Total weights should sum to 1, got ${totalWeight}`
      );
    });
  });
});
