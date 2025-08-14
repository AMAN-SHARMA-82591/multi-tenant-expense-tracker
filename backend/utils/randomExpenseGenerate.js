export default function randomExpenseGenerate(tenantId) {
  const titles = [
    "Groceries",
    "Dinner with friends",
    "Morning coffee",
    "Rent payment",
    "Gas for the car",
    "Online shopping",
    "Subscription service",
    "Utility bill",
    "Movie tickets",
    "Gym membership",
    "Car insurance",
  ];

  const categories = [
    "Food",
    "Housing",
    "Transportation",
    "Entertainment",
    "Bills",
    "Shopping",
    "Health",
  ];

  const expenses = [];

  for (let i = 0; i < 50; i++) {
    const randomAmount = (Math.random() * 490 + 10).toFixed(2);

    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];

    const start = new Date(2025, 0, 1).getTime(); // Jan 1, 2025
    const end = new Date().getTime(); // current date
    const randomTimestamp = start + Math.random() * (end - start);
    const randomDate = new Date(randomTimestamp).toISOString();

    const expense = {
      title: randomTitle,
      category: randomCategory,
      amount: parseFloat(randomAmount),
      date: randomDate,
      tenantId,
    };

    expenses.push(expense);
  }
  return expenses;
}
