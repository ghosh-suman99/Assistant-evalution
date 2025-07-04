import inquirer from "inquirer";
import chalk from "chalk";
import AssistantEvaluator from "./evaluator.js";
import MockDataGenerator from "./mock-data-generator.js";

class CLI {
  async start() {
    console.log(chalk.blue.bold("🤖 Ottavia Assistant Evaluator"));
    console.log(
      chalk.gray("Evaluate your health assistant with comprehensive testing\n")
    );

    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          { name: "🧪 Run Full Evaluation", value: "evaluate" },
          { name: "📊 Generate Mock Data", value: "mock-data" },
          { name: "🔍 Run Single Test", value: "single-test" },
          { name: "📈 View Last Report", value: "view-report" },
          { name: "⚙️  Configure Settings", value: "configure" },
          { name: "❌ Exit", value: "exit" },
        ],
      },
    ]);

    switch (action) {
      case "evaluate":
        await this.runEvaluation();
        break;
      case "mock-data":
        await this.generateMockData();
        break;
      case "single-test":
        await this.runSingleTest();
        break;
      case "view-report":
        await this.viewReport();
        break;
      case "configure":
        await this.configure();
        break;
      case "exit":
        console.log(chalk.green("👋 Goodbye!"));
        process.exit(0);
        break;
    }

    // Return to menu
    setTimeout(() => this.start(), 2000);
  }

  async runEvaluation() {
    console.log(chalk.yellow("🚀 Starting full evaluation..."));
    const evaluator = new AssistantEvaluator();
    await evaluator.runEvaluation();
  }

  async generateMockData() {
    console.log(chalk.yellow("📊 Generating mock health data..."));
    const generator = new MockDataGenerator();
    await generator.generateMockData();
    console.log(chalk.green("✅ Mock data generated successfully!"));
  }

  async runSingleTest() {
    // Implementation for running a single test case
    console.log(chalk.blue("🔍 Single test functionality coming soon..."));
  }

  async viewReport() {
    // Implementation for viewing the last report
    console.log(chalk.blue("📈 Report viewing functionality coming soon..."));
  }

  async configure() {
    // Implementation for configuration
    console.log(chalk.blue("⚙️ Configuration functionality coming soon..."));
  }
}

// Start the CLI
const cli = new CLI();
cli.start().catch(console.error);
