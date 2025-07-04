# Ottavia Assistant Evaluator

A comprehensive evaluation framework for testing your Ottavia health assistant built with OpenAI's Assistant API.

## Features

- **Comprehensive Testing**: Evaluate cross-domain insights, function calling, and data interpretation
- **Mock Data Generation**: Generate realistic health data for testing
- **Automated Scoring**: Multi-dimensional scoring system with detailed feedback
- **Detailed Reports**: JSON reports with recommendations for improvement
- **Interactive CLI**: Easy-to-use command-line interface

## Setup

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure Environment**
   \`\`\`bash
   cp .env.example .env

   # Edit .env with your OpenAI API key and Assistant ID

   \`\`\`

3. **Generate Mock Data**
   \`\`\`bash
   npm run test
   \`\`\`

## Usage

### Run Full Evaluation

\`\`\`bash
npm run evaluate
\`\`\`

### Interactive Mode

\`\`\`bash
npm start
\`\`\`

### Generate Reports

\`\`\`bash
npm run report
\`\`\`

## Test Categories

### 1. Cross-Domain Insights

Tests the assistant's ability to connect data across multiple health domains (sleep, stress, training, nutrition, HRV).

### 2. Function Calling

Validates proper use of nutrition logging and preference logging functions.

### 3. Data Interpretation

Ensures accurate interpretation of health data files and appropriate timeframe analysis.

### 4. Tone and Format

Evaluates adherence to the sharp, concise tone and mobile-friendly format requirements.

## Evaluation Metrics

- **Behavior Scores**: Individual scores for expected behaviors
- **Function Call Accuracy**: Correctness of function calls
- **Overall Score**: Weighted combination of all metrics
- **Pass/Fail Threshold**: 70% overall score

## Mock Data Structure

The evaluator generates realistic mock data files:

- `activity_data.json` - Workout and activity metrics
- `sleep_data.json` - Sleep stages and quality metrics
- `hrv_data.json` - Heart rate variability data
- `nutrition_data.json` - Food intake logs
- `stress_data.json` - Daily stress level breakdowns

## Customization

### Adding Test Cases

Edit `src/test-cases.js` to add new test scenarios:

\`\`\`javascript
{
id: 'custom_test_1',
category: 'custom_category',
prompt: 'Your test prompt here',
expectedBehaviors: ['behavior_1', 'behavior_2'],
mockDataFiles: ['required_data.json'],
expectedFunctionCalls: ['function_name'],
priority: 'high'
}
\`\`\`

### Custom Evaluation Criteria

Modify `evaluationCriteria` in `src/test-cases.js` to adjust scoring weights and add new metrics.

## Reports

Evaluation reports are saved in the `reports/` directory and include:

- Test results with scores and feedback
- Category-wise performance analysis
- Recommendations for improvement
- Detailed response analysis

## Troubleshooting

### Common Issues

1. **Assistant ID Not Found**

   - Verify your Assistant ID in the .env file
   - Ensure the assistant exists in your OpenAI account

2. **Function Calls Not Working**

   - Check that your assistant has the correct functions configured
   - Verify function schemas match the expected format

3. **Mock Data Issues**
   - Run `npm run mock-data` to regenerate test data
   - Check file permissions in the data directory

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## License

MIT License - see LICENSE file for details
