export interface AISuggestion {
  id: string;
  toolId: string;
  reason: string;
  tag: string;
}

export function getSmartRecommendations(recentToolIds: string[]): AISuggestion[] {
  const currentHour = new Date().getHours();
  const suggestions: AISuggestion[] = [];

  // Time-based smart recommendations
  if (currentHour >= 6 && currentHour < 12) {
    suggestions.push({
      id: 's-morning-1',
      toolId: 'pomodoro-timer',
      reason: 'Kickstart your morning focus block with timed work sessions.',
      tag: 'Morning Routine'
    });
    suggestions.push({
      id: 's-morning-2',
      toolId: 'habit-tracker',
      reason: 'Log your morning habits & check off your daily goals.',
      tag: 'Daily Goals'
    });
  } else if (currentHour >= 12 && currentHour < 18) {
    suggestions.push({
      id: 's-afternoon-1',
      toolId: 'scientific-calculator',
      reason: 'Ideal for afternoon engineering calculations and statistical data.',
      tag: 'Productivity'
    });
    suggestions.push({
      id: 's-afternoon-2',
      toolId: 'json-formatter',
      reason: 'Validate and beautify developer API responses.',
      tag: 'Dev Workflow'
    });
  } else {
    suggestions.push({
      id: 's-evening-1',
      toolId: 'expense-tracker',
      reason: 'Review and categorize today\'s expenses before closing shop.',
      tag: 'Evening Review'
    });
    suggestions.push({
      id: 's-evening-2',
      toolId: 'quick-notes',
      reason: 'Jot down thoughts & draft tomorrow\'s checklist.',
      tag: 'Mind Dump'
    });
  }

  // Cross-category workflow recommendations based on recent tools
  if (recentToolIds.includes('jwt-decoder') || recentToolIds.includes('json-formatter')) {
    suggestions.push({
      id: 's-dev-1',
      toolId: 'regex-tester',
      reason: 'Next in dev workflow: Test and validate string regular expressions.',
      tag: 'Recommended Next'
    });
  }

  if (recentToolIds.includes('bmi-calculator')) {
    suggestions.push({
      id: 's-health-1',
      toolId: 'bmr-tdee-calculator',
      reason: 'Calculate your total daily energy expenditure based on your BMI.',
      tag: 'Health Insights'
    });
  }

  // Fallback high utility tools if list is short
  if (suggestions.length < 3) {
    suggestions.push({
      id: 's-fav-1',
      toolId: 'qr-generator',
      reason: 'Generate styled QR codes with customizable colors and logos.',
      tag: 'Popular Utility'
    });
    suggestions.push({
      id: 's-fav-2',
      toolId: 'unit-converter',
      reason: 'Convert length, weight, temperature & volume units instantly.',
      tag: 'Essential'
    });
  }

  return suggestions.slice(0, 4);
}
