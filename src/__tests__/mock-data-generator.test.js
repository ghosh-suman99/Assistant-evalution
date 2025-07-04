import { describe, it } from "node:test";
import assert from "node:assert";
import MockDataGenerator from "../mock-data-generator.js";

describe("MockDataGenerator", () => {
  let generator;

  beforeEach(() => {
    generator = new MockDataGenerator();
  });

  describe("generateActivityData", () => {
    it("should generate 7 days of activity data", () => {
      const data = generator.generateActivityData();
      assert.strictEqual(data.length, 7);
    });

    it("should have required fields", () => {
      const data = generator.generateActivityData();
      const activity = data[0];

      assert.ok(activity.hasOwnProperty("Date"));
      assert.ok(activity.hasOwnProperty("Duration"));
      assert.ok(activity.hasOwnProperty("Steps"));
      assert.ok(activity.hasOwnProperty("Distance"));
      assert.ok(activity.hasOwnProperty("Calories"));
    });

    it("should have realistic values", () => {
      const data = generator.generateActivityData();
      const activity = data[0];

      assert.ok(activity.Steps > 0);
      assert.ok(activity.Steps < 20000);
      assert.ok(activity.Distance > 0);
      assert.ok(activity.Calories > 0);
    });

    it("should have valid date format", () => {
      const data = generator.generateActivityData();
      const activity = data[0];

      // Check if date is in YYYY-MM-DD format
      assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(activity.Date));
    });
  });

  describe("generateSleepData", () => {
    it("should generate 7 days of sleep data", () => {
      const data = generator.generateSleepData();
      assert.strictEqual(data.length, 7);
    });

    it("should have required sleep fields", () => {
      const data = generator.generateSleepData();
      const sleep = data[0];

      assert.ok(sleep.hasOwnProperty("Total"));
      assert.ok(sleep.hasOwnProperty("Deep"));
      assert.ok(sleep.hasOwnProperty("Rem"));
      assert.ok(sleep.hasOwnProperty("Light"));
      assert.ok(sleep.hasOwnProperty("Avg HRV"));
    });

    it("should have realistic sleep values", () => {
      const data = generator.generateSleepData();
      const sleep = data[0];

      assert.ok(sleep["Avg HRV"] > 0);
      assert.ok(sleep["Avg HRV"] < 100);
      assert.ok(sleep["Resting Heart Rate"] > 30);
      assert.ok(sleep["Resting Heart Rate"] < 100);
    });
  });

  describe("generateHRVData", () => {
    it("should generate 7 days of HRV data", () => {
      const data = generator.generateHRVData();
      assert.strictEqual(data.length, 7);
    });

    it("should have HRV fields", () => {
      const data = generator.generateHRVData();
      const hrv = data[0];

      assert.ok(hrv.hasOwnProperty("HRV Night Avg"));
      assert.ok(hrv.hasOwnProperty("HRV Night Max"));
      assert.ok(hrv.hasOwnProperty("HRV Measure Time"));
    });
  });

  describe("utility functions", () => {
    it("should generate random integers in range", () => {
      for (let i = 0; i < 10; i++) {
        const value = generator.randomInt(10, 20);
        assert.ok(value >= 10);
        assert.ok(value <= 20);
        assert.ok(Number.isInteger(value));
      }
    });

    it("should generate random floats in range", () => {
      for (let i = 0; i < 10; i++) {
        const value = generator.randomFloat(1.0, 2.0);
        assert.ok(value >= 1.0);
        assert.ok(value <= 2.0);
        assert.ok(typeof value === "number");
      }
    });

    it("should generate time strings", () => {
      const time = generator.randomTime(6, 9);
      assert.ok(/^\d{2}:\d{2}$/.test(time));

      const [hours, minutes] = time.split(":").map(Number);
      assert.ok(hours >= 6);
      assert.ok(hours <= 9);
      assert.ok(minutes >= 0);
      assert.ok(minutes <= 59);
    });

    it("should generate time strings with minutes when specified", () => {
      const time = generator.randomTime(6, 9, true);
      assert.ok(/^\d{2}:\d{2}$/.test(time));

      const [hours, minutes] = time.split(":").map(Number);
      assert.ok(hours >= 6);
      assert.ok(hours <= 9);
      assert.ok(minutes >= 0);
      assert.ok(minutes <= 59);
    });
  });
});
