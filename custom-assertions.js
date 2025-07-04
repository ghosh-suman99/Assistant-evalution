// Custom assertion functions for Promptfoo

export function extractFunctionCalls(output) {
  // Extract function calls from assistant response
  const functionCallRegex = /function_call:\s*({.*?})/g;
  const calls = [];
  let match;

  while ((match = functionCallRegex.exec(output)) !== null) {
    try {
      calls.push(JSON.parse(match[1]));
    } catch (e) {
      // Invalid JSON, skip
    }
  }

  return calls;
}

export function validateCrossDomainInsight(output, context) {
  const domains = [
    "sleep",
    "stress",
    "training",
    "nutrition",
    "hrv",
    "recovery",
  ];
  const mentionedDomains = domains.filter((domain) =>
    output.toLowerCase().includes(domain)
  );

  return {
    pass: mentionedDomains.length >= 2,
    score: mentionedDomains.length / domains.length,
    reason: `Mentioned ${
      mentionedDomains.length
    } domains: ${mentionedDomains.join(", ")}`,
  };
}

export function validateMobileFriendly(output) {
  const wordCount = output.split(" ").length;
  const isAppropriateLength = wordCount <= 100;

  return {
    pass: isAppropriateLength,
    score: isAppropriateLength ? 1 : Math.max(0, 1 - (wordCount - 100) / 100),
    reason: `${wordCount} words (target: ≤100)`,
  };
}

export function validateNutritionLogging(output, functionCalls) {
  const hasNutritionCall = functionCalls?.some(
    (call) => call.name === "get_nutrition_from_image"
  );

  const hasConfirmation =
    output.toLowerCase().includes("added to your data") ||
    output.toLowerCase().includes("logged") ||
    output.toLowerCase().includes("recorded");

  const hasFunFact =
    output.toLowerCase().includes("fun fact") ||
    /ancient|originally|historically|studies show|research/.test(
      output.toLowerCase()
    );

  return {
    pass: hasNutritionCall && hasConfirmation,
    score:
      (hasNutritionCall ? 0.5 : 0) +
      (hasConfirmation ? 0.3 : 0) +
      (hasFunFact ? 0.2 : 0),
    reason: `Function call: ${hasNutritionCall}, Confirmation: ${hasConfirmation}, Fun fact: ${hasFunFact}`,
  };
}
