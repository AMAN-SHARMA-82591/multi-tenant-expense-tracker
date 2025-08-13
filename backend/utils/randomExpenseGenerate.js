export default function randomExpenseGenerate() {
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

  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1).getTime();
  const endOfYear = new Date(currentYear, 11, 31).getTime();

  for (let i = 0; i < 50; i++) {
    const randomAmount = (Math.random() * 490 + 10).toFixed(2);

    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];

    const randomTimestamp =
      startOfYear + Math.random() * (endOfYear - startOfYear);
    const randomDate = new Date(randomTimestamp).toISOString();

    const expense = {
      title: randomTitle,
      category: randomCategory,
      amount: parseFloat(randomAmount),
      date: randomDate,
      tenantId: req.tenantId,
    };

    expenses.push(expense);
  }
  return expenses;
}
