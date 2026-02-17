import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = path.join(__dirname, 'data');
const MENU_FILE = path.join(DB_DIR, 'menu.json');

console.log('Seeding database with sample menu items...\n');

const sampleItems = [
  // Starters
  { id: 1, name: 'Paneer Tikka', category: 'Starter', price: 250, available: 1 },
  { id: 2, name: 'Chicken Wings', category: 'Starter', price: 280, available: 1 },
  { id: 3, name: 'Spring Rolls', category: 'Starter', price: 180, available: 1 },
  { id: 4, name: 'French Fries', category: 'Starter', price: 120, available: 1 },
  
  // Main Course
  { id: 5, name: 'Butter Chicken', category: 'Main Course', price: 350, available: 1 },
  { id: 6, name: 'Palak Paneer', category: 'Main Course', price: 280, available: 1 },
  { id: 7, name: 'Chicken Biryani', category: 'Main Course', price: 320, available: 1 },
  { id: 8, name: 'Veg Biryani', category: 'Main Course', price: 250, available: 1 },
  { id: 9, name: 'Dal Makhani', category: 'Main Course', price: 220, available: 1 },
  
  // Breads
  { id: 10, name: 'Butter Naan', category: 'Bread', price: 50, available: 1 },
  { id: 11, name: 'Garlic Naan', category: 'Bread', price: 60, available: 1 },
  { id: 12, name: 'Tandoori Roti', category: 'Bread', price: 30, available: 1 },
  { id: 13, name: 'Cheese Naan', category: 'Bread', price: 80, available: 1 },
  
  // Rice
  { id: 14, name: 'Jeera Rice', category: 'Rice', price: 150, available: 1 },
  { id: 15, name: 'Steam Rice', category: 'Rice', price: 100, available: 1 },
  
  // Drinks
  { id: 16, name: 'Coke', category: 'Drink', price: 50, available: 1 },
  { id: 17, name: 'Pepsi', category: 'Drink', price: 50, available: 1 },
  { id: 18, name: 'Lassi', category: 'Drink', price: 80, available: 1 },
  { id: 19, name: 'Fresh Lime Soda', category: 'Drink', price: 60, available: 1 },
  { id: 20, name: 'Mineral Water', category: 'Drink', price: 30, available: 1 },
  
  // Desserts
  { id: 21, name: 'Gulab Jamun', category: 'Dessert', price: 80, available: 1 },
  { id: 22, name: 'Ice Cream', category: 'Dessert', price: 100, available: 1 },
  { id: 23, name: 'Brownie with Ice Cream', category: 'Dessert', price: 150, available: 1 }
];

// Create data directory if it doesn't exist
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR);
}

// Write menu items
fs.writeFileSync(MENU_FILE, JSON.stringify(sampleItems, null, 2));

console.log(`✓ Successfully added ${sampleItems.length} menu items!\n`);

sampleItems.forEach(item => {
  console.log(`  ${item.name.padEnd(30)} ${item.category.padEnd(15)} ₹${item.price}`);
});

console.log('\n✓ Seed data loaded successfully!');
console.log('\nYou can now start the POS system with: npm start');
