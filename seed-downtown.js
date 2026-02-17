import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = path.join(__dirname, 'data');
const MENU_FILE = path.join(DB_DIR, 'menu.json');

console.log('\n╔════════════════════════════════════════════════════╗');
console.log('║     DOWNTOWN RESTAURANT - Menu Seed Data          ║');
console.log('╚════════════════════════════════════════════════════╝\n');

const menuItems = [
  // WHISKEY
  { id: 1, name: 'Royal Stag', category: 'Whiskey', price: 110, available: 1 },
  { id: 2, name: 'Signature', category: 'Whiskey', price: 140, available: 1 },
  { id: 3, name: 'Blenders Pride', category: 'Whiskey', price: 150, available: 1 },
  { id: 4, name: 'Vat 69', category: 'Whiskey', price: 270, available: 1 },
  { id: 5, name: 'Black Dog', category: 'Whiskey', price: 280, available: 1 },
  { id: 6, name: "Teacher's 50", category: 'Whiskey', price: 290, available: 1 },
  { id: 7, name: 'Ballantines', category: 'Whiskey', price: 300, available: 1 },
  { id: 8, name: 'Black & White', category: 'Whiskey', price: 300, available: 1 },
  { id: 9, name: 'Red Label', category: 'Whiskey', price: 310, available: 1 },
  { id: 10, name: 'Jim Beam', category: 'Whiskey', price: 390, available: 1 },
  { id: 11, name: 'Jack Daniels', category: 'Whiskey', price: 450, available: 1 },
  { id: 12, name: 'Jameson', category: 'Whiskey', price: 330, available: 1 },

  // WINE
  { id: 13, name: 'Samara Red Wine', category: 'Wine', price: 250, available: 1 },
  { id: 14, name: 'Vasco Red Wine', category: 'Wine', price: 250, available: 1 },
  { id: 15, name: 'Kyra Red Wine', category: 'Wine', price: 250, available: 1 },
  { id: 16, name: 'Saino Red Wine', category: 'Wine', price: 250, available: 1 },
  { id: 17, name: 'Zum Zom White Wine', category: 'Wine', price: 260, available: 1 },
  { id: 18, name: 'Mosso White Wine', category: 'Wine', price: 260, available: 1 },

  // TEA & COFFEE
  { id: 19, name: 'Milk Tea', category: 'Tea & Coffee', price: 40, available: 1 },
  { id: 20, name: 'Black Tea', category: 'Tea & Coffee', price: 20, available: 1 },
  { id: 21, name: 'Milk Coffee', category: 'Tea & Coffee', price: 60, available: 1 },
  { id: 22, name: 'Black Coffee', category: 'Tea & Coffee', price: 30, available: 1 },
  { id: 23, name: 'Green Tea', category: 'Tea & Coffee', price: 40, available: 1 },
  { id: 24, name: 'Ginger Lemon Honey Tea', category: 'Tea & Coffee', price: 70, available: 1 },

  // SOFT DRINKS
  { id: 25, name: 'Lemon Water', category: 'Soft Drinks', price: 50, available: 1 },
  { id: 26, name: 'Lemon Soda', category: 'Soft Drinks', price: 70, available: 1 },
  { id: 27, name: 'Masala Cold Drink', category: 'Soft Drinks', price: 80, available: 1 },
  { id: 28, name: 'Soda Bottle', category: 'Soft Drinks', price: 60, available: 1 },
  { id: 29, name: 'Red Bull', category: 'Soft Drinks', price: 180, available: 1 },
  { id: 30, name: 'Fruit Juice', category: 'Soft Drinks', price: 100, available: 1 },
  { id: 31, name: 'Cold Coffee', category: 'Soft Drinks', price: 130, available: 1 },
  { id: 32, name: 'Iced Tea', category: 'Soft Drinks', price: 110, available: 1 },

  // VODKA
  { id: 33, name: 'White Mischief', category: 'Vodka', price: 100, available: 1 },
  { id: 34, name: 'Magic Moments Plain', category: 'Vodka', price: 110, available: 1 },
  { id: 35, name: 'Magic Moments Flavour', category: 'Vodka', price: 130, available: 1 },
  { id: 36, name: 'Smirnoff Plain', category: 'Vodka', price: 150, available: 1 },
  { id: 37, name: 'Smirnoff Flavour', category: 'Vodka', price: 160, available: 1 },
  { id: 38, name: 'Absolute', category: 'Vodka', price: 310, available: 1 },

  // TEQUILA
  { id: 39, name: 'Crystal Jin', category: 'Tequila', price: 90, available: 1 },
  { id: 40, name: 'Tequila Gold', category: 'Tequila', price: 330, available: 1 },

  // BEER
  { id: 41, name: 'Hit', category: 'Beer', price: 160, available: 1 },
  { id: 42, name: 'Kingfisher', category: 'Beer', price: 160, available: 1 },
  { id: 43, name: 'Old Monk Can', category: 'Beer', price: 160, available: 1 },
  { id: 44, name: 'Dansberg', category: 'Beer', price: 160, available: 1 },
  { id: 45, name: 'Kingfisher Can', category: 'Beer', price: 190, available: 1 },
  { id: 46, name: 'Budweiser Can', category: 'Beer', price: 260, available: 1 },
  { id: 47, name: 'Budweiser Magnum Can', category: 'Beer', price: 270, available: 1 },
  { id: 48, name: 'Corona', category: 'Beer', price: 260, available: 1 },
  { id: 49, name: 'Breezer', category: 'Beer', price: 160, available: 1 },

  // RUM
  { id: 50, name: 'Old Monk Coffee', category: 'Rum', price: 140, available: 1 },
  { id: 51, name: 'Bacardi Plain', category: 'Rum', price: 150, available: 1 },
  { id: 52, name: 'Bacardi Flavour', category: 'Rum', price: 160, available: 1 },

  // BRANDY
  { id: 53, name: 'Mansion House Plain', category: 'Brandy', price: 110, available: 1 },
  { id: 54, name: 'Mansion House Flavour', category: 'Brandy', price: 140, available: 1 },
  { id: 55, name: 'Morpheus', category: 'Brandy', price: 190, available: 1 },

  // VEG MAIN COURSE
  { id: 56, name: 'Aloo Dum', category: 'Veg Main Course', price: 170, available: 1 },
  { id: 57, name: 'Aloo Matar', category: 'Veg Main Course', price: 190, available: 1 },
  { id: 58, name: 'Matar Paneer', category: 'Veg Main Course', price: 250, available: 1 },
  { id: 59, name: 'Mixed Veg', category: 'Veg Main Course', price: 200, available: 1 },
  { id: 60, name: 'Kadai Veg', category: 'Veg Main Course', price: 230, available: 1 },
  { id: 61, name: 'Kadai Paneer', category: 'Veg Main Course', price: 260, available: 1 },
  { id: 62, name: 'Veg Manchurian', category: 'Veg Main Course', price: 220, available: 1 },
  { id: 63, name: 'Paneer Butter Masala', category: 'Veg Main Course', price: 270, available: 1 },
  { id: 64, name: 'Mushroom Butter Masala', category: 'Veg Main Course', price: 250, available: 1 },

  // NON-VEG MAIN COURSE
  { id: 65, name: 'Chicken Curry', category: 'Non-Veg Main Course', price: 290, available: 1 },
  { id: 66, name: 'Kadai Chicken', category: 'Non-Veg Main Course', price: 290, available: 1 },
  { id: 67, name: 'Chicken Kolapuri', category: 'Non-Veg Main Course', price: 290, available: 1 },
  { id: 68, name: 'Chicken Butter Masala', category: 'Non-Veg Main Course', price: 310, available: 1 },
  { id: 69, name: 'Chicken Manchurian', category: 'Non-Veg Main Course', price: 300, available: 1 },
  { id: 70, name: 'Chicken Masala', category: 'Non-Veg Main Course', price: 300, available: 1 },
  { id: 71, name: 'Schezwan Chicken', category: 'Non-Veg Main Course', price: 290, available: 1 },
  { id: 72, name: 'Chicken Do Pyaza', category: 'Non-Veg Main Course', price: 290, available: 1 },

  // ROTI & DAL
  { id: 73, name: 'Plain Tawa Roti', category: 'Roti & Dal', price: 20, available: 1 },
  { id: 74, name: 'Butter Roti', category: 'Roti & Dal', price: 30, available: 1 },
  { id: 75, name: 'Yellow Dal Fry', category: 'Roti & Dal', price: 140, available: 1 },
  { id: 76, name: 'Yellow Dal Tadka', category: 'Roti & Dal', price: 160, available: 1 },

  // SALAD
  { id: 77, name: 'Green Salad', category: 'Salad', price: 90, available: 1 },
  { id: 78, name: 'Vegetables Salad', category: 'Salad', price: 160, available: 1 },
  { id: 79, name: 'Chicken Salad', category: 'Salad', price: 350, available: 1 },
  { id: 80, name: 'Veg Greek Salad', category: 'Salad', price: 180, available: 1 },
  { id: 81, name: 'Chicken Greek Salad', category: 'Salad', price: 350, available: 1 },

  // TIBETAN
  { id: 82, name: 'Veg Momo Steam', category: 'Tibetan', price: 130, available: 1 },
  { id: 83, name: 'Veg Momo Fried', category: 'Tibetan', price: 150, available: 1 },
  { id: 84, name: 'Chicken Momo Steam', category: 'Tibetan', price: 180, available: 1 },
  { id: 85, name: 'Chicken Momo Fried', category: 'Tibetan', price: 200, available: 1 },
  { id: 86, name: 'Veg Momo Chilli', category: 'Tibetan', price: 190, available: 1 },
  { id: 87, name: 'Chicken Momo Chilli', category: 'Tibetan', price: 240, available: 1 },
  { id: 88, name: 'Veg Thukpa', category: 'Tibetan', price: 160, available: 1 },
  { id: 89, name: 'Chicken Thukpa', category: 'Tibetan', price: 180, available: 1 },
  { id: 90, name: 'Chicken Gyathuk', category: 'Tibetan', price: 210, available: 1 },

  // PASTA
  { id: 91, name: 'Veg White Sauce Pasta', category: 'Pasta', price: 190, available: 1 },
  { id: 92, name: 'Veg Red Sauce Pasta', category: 'Pasta', price: 190, available: 1 },
  { id: 93, name: 'Veg Mixed Sauce Pasta', category: 'Pasta', price: 220, available: 1 },
  { id: 94, name: 'Mushroom White Sauce Pasta', category: 'Pasta', price: 190, available: 1 },
  { id: 95, name: 'Mushroom Red Sauce Pasta', category: 'Pasta', price: 190, available: 1 },
  { id: 96, name: 'Mushroom Mixed Sauce Pasta', category: 'Pasta', price: 220, available: 1 },
  { id: 97, name: 'Chicken White Sauce Pasta', category: 'Pasta', price: 250, available: 1 },
  { id: 98, name: 'Chicken Red Sauce Pasta', category: 'Pasta', price: 250, available: 1 },
  { id: 99, name: 'Chicken Mixed Sauce Pasta', category: 'Pasta', price: 280, available: 1 },

  // SANDWICH
  { id: 100, name: 'Veg Sandwich', category: 'Sandwich', price: 130, available: 1 },
  { id: 101, name: 'Egg Sandwich', category: 'Sandwich', price: 170, available: 1 },
  { id: 102, name: 'Egg & Cheese Sandwich', category: 'Sandwich', price: 200, available: 1 },
  { id: 103, name: 'Corn & Cheese Sandwich', category: 'Sandwich', price: 210, available: 1 },
  { id: 104, name: 'Chicken Sandwich', category: 'Sandwich', price: 210, available: 1 },
  { id: 105, name: 'Chicken & Cheese Sandwich', category: 'Sandwich', price: 240, available: 1 },
  { id: 106, name: 'Egg & Chicken Sandwich', category: 'Sandwich', price: 280, available: 1 },
  { id: 107, name: 'Chicken Ham Sandwich', category: 'Sandwich', price: 190, available: 1 },
  { id: 108, name: 'Chicken & Ham Sandwich', category: 'Sandwich', price: 260, available: 1 },
  { id: 109, name: 'Club Sandwich', category: 'Sandwich', price: 320, available: 1 },

  // VEG SOUP
  { id: 110, name: 'Veg Hot & Sour Soup', category: 'Veg Soup', price: 130, available: 1 },
  { id: 111, name: 'Veg Manchow Soup', category: 'Veg Soup', price: 140, available: 1 },
  { id: 112, name: 'Mushroom Soup', category: 'Veg Soup', price: 130, available: 1 },
  { id: 113, name: 'Veg Clear Soup', category: 'Veg Soup', price: 120, available: 1 },
  { id: 114, name: 'Lemon Coriander Soup', category: 'Veg Soup', price: 140, available: 1 },
  { id: 115, name: 'Veg Sweet Corn Soup', category: 'Veg Soup', price: 140, available: 1 },

  // NON-VEG SOUP
  { id: 116, name: 'Chicken Hot & Sour Soup', category: 'Non-Veg Soup', price: 150, available: 1 },
  { id: 117, name: 'Chicken Manchow Soup', category: 'Non-Veg Soup', price: 160, available: 1 },
  { id: 118, name: 'Chicken Mushroom Soup', category: 'Non-Veg Soup', price: 150, available: 1 },
  { id: 119, name: 'Chicken Clear Soup', category: 'Non-Veg Soup', price: 140, available: 1 },
  { id: 120, name: 'Chicken Sweet Corn Soup', category: 'Non-Veg Soup', price: 150, available: 1 },
  { id: 121, name: 'Chicken Wonton Soup', category: 'Non-Veg Soup', price: 180, available: 1 },

  // RAMEN
  { id: 122, name: 'Egg Ramen', category: 'Ramen', price: 240, available: 1 },
  { id: 123, name: 'Egg & Sausage Ramen', category: 'Ramen', price: 290, available: 1 },

  // MOCKTAILS
  { id: 124, name: 'Virgin Mojito', category: 'Mocktails', price: 160, available: 1 },
  { id: 125, name: 'Mangola', category: 'Mocktails', price: 170, available: 1 },
  { id: 126, name: 'Strawberry Crush', category: 'Mocktails', price: 160, available: 1 },
  { id: 127, name: 'Blue Lagoon', category: 'Mocktails', price: 180, available: 1 },
  { id: 128, name: 'Sex on the Beach (Mocktail)', category: 'Mocktails', price: 190, available: 1 },
  { id: 129, name: 'Downtown Special', category: 'Mocktails', price: 260, available: 1 },

  // COCKTAILS
  { id: 130, name: 'Screwdriver', category: 'Cocktails', price: 280, available: 1 },
  { id: 131, name: 'Cosmopolitan', category: 'Cocktails', price: 280, available: 1 },
  { id: 132, name: 'Out of School', category: 'Cocktails', price: 280, available: 1 },
  { id: 133, name: 'Safe Sex on the Beach', category: 'Cocktails', price: 300, available: 1 },
  { id: 134, name: 'Long Island Iced Tea', category: 'Cocktails', price: 450, available: 1 },
  { id: 135, name: 'Tequila Sunrise', category: 'Cocktails', price: 350, available: 1 },
  { id: 136, name: 'Blue Hawaiian', category: 'Cocktails', price: 370, available: 1 },

  // VEG STARTERS
  { id: 137, name: 'Potato Chilli', category: 'Veg Starters', price: 170, available: 1 },
  { id: 138, name: 'Honey Potato Chilli', category: 'Veg Starters', price: 190, available: 1 },
  { id: 139, name: 'French Fries', category: 'Veg Starters', price: 150, available: 1 },
  { id: 140, name: 'Peri Peri French Fries', category: 'Veg Starters', price: 160, available: 1 },
  { id: 141, name: 'Crispy Corn', category: 'Veg Starters', price: 210, available: 1 },
  { id: 142, name: 'Veg Pakoda', category: 'Veg Starters', price: 160, available: 1 },
  { id: 143, name: 'Paneer Chilli', category: 'Veg Starters', price: 240, available: 1 },
  { id: 144, name: 'Paneer Pakoda', category: 'Veg Starters', price: 220, available: 1 },
  { id: 145, name: 'Peanut Masala', category: 'Veg Starters', price: 130, available: 1 },
  { id: 146, name: 'Masala Papad', category: 'Veg Starters', price: 120, available: 1 },
  { id: 147, name: 'Mushroom Chilli', category: 'Veg Starters', price: 240, available: 1 },
  { id: 148, name: 'Baby Corn Chilli', category: 'Veg Starters', price: 230, available: 1 },
  { id: 149, name: 'Crispy Baby Corn', category: 'Veg Starters', price: 240, available: 1 },
  { id: 150, name: 'Cheese Ball', category: 'Veg Starters', price: 300, available: 1 },
  { id: 151, name: 'Sadako Wai Wai', category: 'Veg Starters', price: 90, available: 1 },

  // EGG STARTERS
  { id: 152, name: 'Masala Omelette', category: 'Egg Starters', price: 110, available: 1 },
  { id: 153, name: 'Egg Bhujjiya', category: 'Egg Starters', price: 110, available: 1 },
  { id: 154, name: 'Cheese Omelette', category: 'Egg Starters', price: 170, available: 1 },
  { id: 155, name: 'Boiled Egg', category: 'Egg Starters', price: 90, available: 1 },

  // RICE & NOODLES
  { id: 156, name: 'Plain Rice', category: 'Rice & Noodles', price: 110, available: 1 },
  { id: 157, name: 'Veg Pulao', category: 'Rice & Noodles', price: 160, available: 1 },
  { id: 158, name: 'Burnt Garlic Veg Fried Rice', category: 'Rice & Noodles', price: 150, available: 1 },
  { id: 159, name: 'Burnt Garlic Chk Fried Rice', category: 'Rice & Noodles', price: 180, available: 1 },
  { id: 160, name: 'Veg Fried Rice', category: 'Rice & Noodles', price: 140, available: 1 },
  { id: 161, name: 'Egg Fried Rice', category: 'Rice & Noodles', price: 160, available: 1 },
  { id: 162, name: 'Chicken Fried Rice', category: 'Rice & Noodles', price: 180, available: 1 },
  { id: 163, name: 'Schezwan Veg Fried Rice', category: 'Rice & Noodles', price: 160, available: 1 },
  { id: 164, name: 'Schezwan Chk Fried Rice', category: 'Rice & Noodles', price: 190, available: 1 },
  { id: 165, name: 'Mixed Fried Rice', category: 'Rice & Noodles', price: 220, available: 1 },
  { id: 166, name: 'Jeera Rice', category: 'Rice & Noodles', price: 130, available: 1 },
  { id: 167, name: 'Nasi Goreng Rice Veg', category: 'Rice & Noodles', price: 180, available: 1 },
  { id: 168, name: 'Nasi Goreng Rice Chk', category: 'Rice & Noodles', price: 260, available: 1 },
  { id: 169, name: 'Veg Biryani', category: 'Rice & Noodles', price: 190, available: 1 },
  { id: 170, name: 'Egg Biryani', category: 'Rice & Noodles', price: 240, available: 1 },
  { id: 171, name: 'Chicken Biryani', category: 'Rice & Noodles', price: 280, available: 1 },
  { id: 172, name: 'Veg Hakka Noodles', category: 'Rice & Noodles', price: 140, available: 1 },
  { id: 173, name: 'Egg Hakka Noodles', category: 'Rice & Noodles', price: 160, available: 1 },
  { id: 174, name: 'Chicken Hakka Noodles', category: 'Rice & Noodles', price: 180, available: 1 },
  { id: 175, name: 'Mixed Hakka Noodles', category: 'Rice & Noodles', price: 220, available: 1 },
  { id: 176, name: 'American Chopsey Veg', category: 'Rice & Noodles', price: 190, available: 1 },
  { id: 177, name: 'American Chopsey Chk', category: 'Rice & Noodles', price: 240, available: 1 },
  { id: 178, name: 'Chinese Chopsey Veg', category: 'Rice & Noodles', price: 190, available: 1 },
  { id: 179, name: 'Chinese Chopsey Chk', category: 'Rice & Noodles', price: 220, available: 1 },

  // NON-VEG STARTERS
  { id: 180, name: 'Chicken Pakoda', category: 'Non-Veg Starters', price: 290, available: 1 },
  { id: 181, name: 'Chicken Dry Fry', category: 'Non-Veg Starters', price: 280, available: 1 },
  { id: 182, name: 'Chicken Chilli (W.B)', category: 'Non-Veg Starters', price: 280, available: 1 },
  { id: 183, name: 'Chicken Chilli (B.L)', category: 'Non-Veg Starters', price: 310, available: 1 },
  { id: 184, name: 'B.B.Q Chicken (W.B)', category: 'Non-Veg Starters', price: 300, available: 1 },
  { id: 185, name: 'B.B.Q Chicken (B.L)', category: 'Non-Veg Starters', price: 350, available: 1 },
  { id: 186, name: 'Drums of Heaven', category: 'Non-Veg Starters', price: 330, available: 1 },
  { id: 187, name: 'Peri Peri Lolipop', category: 'Non-Veg Starters', price: 350, available: 1 },
  { id: 188, name: 'Hot Wings on Fire', category: 'Non-Veg Starters', price: 380, available: 1 },
  { id: 189, name: 'Peri Peri Wings', category: 'Non-Veg Starters', price: 350, available: 1 },
  { id: 190, name: 'Crispy Fried Chicken', category: 'Non-Veg Starters', price: 360, available: 1 },
  { id: 191, name: 'Crunchy Fried Chicken', category: 'Non-Veg Starters', price: 330, available: 1 },
  { id: 192, name: 'Chicken 65', category: 'Non-Veg Starters', price: 300, available: 1 },
  { id: 193, name: 'Smoked Chicken', category: 'Non-Veg Starters', price: 390, available: 1 },
  { id: 194, name: 'Salt & Pepper Chicken', category: 'Non-Veg Starters', price: 300, available: 1 },
  { id: 195, name: 'Dragon Chicken', category: 'Non-Veg Starters', price: 350, available: 1 },
  { id: 196, name: 'Shredded Chicken', category: 'Non-Veg Starters', price: 330, available: 1 },
  { id: 197, name: 'Hot Pepper Chicken', category: 'Non-Veg Starters', price: 290, available: 1 },
  { id: 198, name: 'Grilled Chicken Breast', category: 'Non-Veg Starters', price: 400, available: 1 },
  { id: 199, name: 'Sadako Chicken', category: 'Non-Veg Starters', price: 300, available: 1 },
  { id: 200, name: 'Lemon Chicken', category: 'Non-Veg Starters', price: 290, available: 1 },
  { id: 201, name: 'Sausage Chilli', category: 'Non-Veg Starters', price: 270, available: 1 },
  { id: 202, name: 'Pan Fried Sausage', category: 'Non-Veg Starters', price: 270, available: 1 },
  { id: 203, name: 'Chicken Local Dry Fry', category: 'Non-Veg Starters', price: 400, available: 1 },
  { id: 204, name: 'Golden Fried Prawn', category: 'Non-Veg Starters', price: 360, available: 1 },
  { id: 205, name: 'Prawn Chilli', category: 'Non-Veg Starters', price: 360, available: 1 },
  { id: 206, name: 'Butter Garlic Prawn', category: 'Non-Veg Starters', price: 360, available: 1 },
  { id: 207, name: 'Hot Pepper Prawn', category: 'Non-Veg Starters', price: 360, available: 1 }
];

// Create data directory if it doesn't exist
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR);
}

// Write menu items
fs.writeFileSync(MENU_FILE, JSON.stringify(menuItems, null, 2));

console.log(`✓ Successfully loaded ${menuItems.length} items from Downtown Restaurant menu!\n`);

// Group by category and display
const categories = {};
menuItems.forEach(item => {
  if (!categories[item.category]) categories[item.category] = [];
  categories[item.category].push(item);
});

console.log('Menu Summary:');
console.log('═'.repeat(60));
Object.keys(categories).sort().forEach(category => {
  console.log(`\n${category} (${categories[category].length} items)`);
  console.log('─'.repeat(60));
});

console.log('\n\n✓ Seed data loaded successfully!');
console.log('\nYou can now start the POS system with:');
console.log('  > npm start (backend)');
console.log('  > cd frontend && npm run dev (frontend)');
console.log('\nOr simply run: start.bat\n');
