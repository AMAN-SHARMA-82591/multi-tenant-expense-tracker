export default function buildExpenseSummaryPrompt(report) {
  const categoryLines = report.categories
    .map((c) => `- ${c.category}: $${c.spend.toFixed(2)}`)
    .join("\n");

  return `
Generate a monthly expense summary. The summary should include total spend, top category, and a short AI-generated text insight.

Monthly Expense Report:
• Total Spend: $${report.totalSpend.toFixed(2)}
• Top Category: ${report.topCategory} ($${report.topCategorySpend.toFixed(2)})
• Category Breakdown:
${categoryLines}

Please generate a short, professional summary highlighting key spending areas and offering a brief insight or suggestion.
`;
}
