import { describe, it } from "node:test";
import assert from "node:assert";
import OpenAIClient from "../openai-client.js";

describe("OpenAIClient", () => {
  let client;

  beforeEach(() => {
    client = new OpenAIClient();
  });

  describe("constructor", () => {
    it("should create OpenAI client instance", () => {
      assert.ok(client.client);
      assert.ok(typeof client.client === "object");
    });
  });

  describe("extractFunctionCalls", () => {
    it("should extract function calls from run status", () => {
      const mockRunStatus = {
        required_action: {
          submit_tool_outputs: {
            tool_calls: [
              {
                function: {
                  name: "get_nutrition_from_image",
                  arguments: '{"food": "apple", "quantity": "1"}',
                },
              },
            ],
          },
        },
      };

      const functionCalls = client.extractFunctionCalls(mockRunStatus);
      assert.strictEqual(functionCalls.length, 1);
      assert.strictEqual(functionCalls[0].name, "get_nutrition_from_image");
      assert.deepStrictEqual(functionCalls[0].arguments, {
        food: "apple",
        quantity: "1",
      });
    });

    it("should return empty array when no function calls", () => {
      const mockRunStatus = {};
      const functionCalls = client.extractFunctionCalls(mockRunStatus);
      assert.strictEqual(functionCalls.length, 0);
    });

    it("should handle invalid JSON in function arguments", () => {
      const mockRunStatus = {
        required_action: {
          submit_tool_outputs: {
            tool_calls: [
              {
                function: {
                  name: "test_function",
                  arguments: "invalid json",
                },
              },
            ],
          },
        },
      };

      const functionCalls = client.extractFunctionCalls(mockRunStatus);
      assert.strictEqual(functionCalls.length, 0); // Should skip invalid JSON
    });
  });
});
