import AssistantEvaluator from "./evaluator.js";
import MockDataGenerator from "./mock-data-generator.js";
import chalk from "chalk";
import { testCases } from "./test-cases.js";

class TestRunner {
  constructor() {
    this.evaluator = new AssistantEvaluator();
    this.mockDataGenerator = new MockDataGenerator();
  }

  async runTests() {
    console.log(chalk.blue.bold("🧪 OTTAVIA ASSISTANT TEST SUITE"));
    console.log(chalk.gray("Running comprehensive evaluation tests...\n"));

    try {
      // Step 1: Generate mock data
      console.log(chalk.yellow("📊 Step 1: Generating mock health data..."));
      await this.mockDataGenerator.generateMockData();
      console.log(chalk.green("✅ Mock data generated\n"));

      // Step 2: Run evaluation tests
      console.log(chalk.yellow("🔬 Step 2: Running evaluation tests..."));
      await this.evaluator.runEvaluation();

      // Step 3: Summary
      this.printTestSummary();
    } catch (error) {
      console.error(chalk.red("❌ Test suite failed:"), error.message);
      process.exit(1);
    }
  }

  printTestSummary() {
    console.log(chalk.blue("\n" + "=".repeat(50)));
    console.log(chalk.blue.bold("📋 TEST SUITE SUMMARY"));
    console.log(chalk.blue("=".repeat(50)));

    console.log(chalk.white(`Total Test Cases: ${testCases.length}`));
    console.log(chalk.white("Categories:"));

    const categories = [...new Set(testCases.map((tc) => tc.category))];
    categories.forEach((category) => {
      const count = testCases.filter((tc) => tc.category === category).length;
      console.log(chalk.gray(`  • ${category}: ${count} tests`));
    });

    console.log(chalk.green("\n✅ Test suite completed successfully!"));
    console.log(
      chalk.gray("Check the reports/ directory for detailed results.")
    );
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const runner = new TestRunner();
  runner.runTests().catch((error) => {
    console.error(chalk.red("Test runner failed:"), error);
    process.exit(1);
  });
}

export default TestRunner;
