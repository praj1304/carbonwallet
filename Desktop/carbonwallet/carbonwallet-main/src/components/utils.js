export const CARBON_FACTORS = {
  fuel: 0.24,
  electricity: 0.18,
  food: 0.02,
  'public-transport': 0.05,
  shopping: 0.12,
  'online-delivery': 0.15,
  healthcare: 0.08,
  entertainment: 0.06,
  groceries: 0.01
};

export const CATEGORY_REWARDS = {
  'public-transport': 10,
  groceries: 5,
  food: 3
};

export const generateTransactions = () => {
  const categories = Object.keys(CARBON_FACTORS);
  const names = {
    fuel: ['Petrol Pump', 'Gas Station', 'Fuel Stop'],
    electricity: ['Electricity Bill', 'Power Payment'],
    food: ['Restaurant', 'Cafe', 'Food Court'],
    'public-transport': ['Metro Card', 'Bus Pass', 'Auto Ride'],
    shopping: ['Shopping Mall', 'Online Store', 'Retail Shop'],
    'online-delivery': ['Swiggy', 'Zomato', 'Amazon'],
    healthcare: ['Pharmacy', 'Hospital', 'Clinic'],
    entertainment: ['Movie Theater', 'Gaming', 'Concert'],
    groceries: ['Supermarket', 'Vegetable Market', 'Grocery Store']
  };

  const transactions = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const numTrans = Math.floor(Math.random() * 3) + 2;
    for (let j = 0; j < numTrans; j++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const nameOptions = names[category];
      const name = nameOptions[Math.floor(Math.random() * nameOptions.length)];
      const amount = Math.floor(Math.random() * 800) + 100;
      
      transactions.push({
        id: `${i}-${j}`,
        name,
        amount,
        category,
        date: date.toISOString().split('T')[0]
      });
    }
  }
  
  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const calculateStats = (transactions, carbonFactors, categoryRewards) => {
  let carbon = 0;
  let points = 0;
  let totalSpent = 0;
  
  transactions.forEach(t => {
    const factor = carbonFactors[t.category] || 0.1;
    carbon += (t.amount / 100) * factor;
    points += categoryRewards[t.category] || 0;
    totalSpent += t.amount;
  });
  
  return { carbon, points, totalSpent };
};

export const filterTransactionsByPeriod = (transactions, timeSegment) => {
  const today = new Date();
  return transactions.filter(t => {
    const transDate = new Date(t.date);
    const diffDays = Math.floor((today - transDate) / (1000 * 60 * 60 * 24));
    
    if (timeSegment === 'daily') return diffDays === 0;
    if (timeSegment === 'weekly') return diffDays <= 7;
    if (timeSegment === 'monthly') return diffDays <= 30;
    return true;
  });
};