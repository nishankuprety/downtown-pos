import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api';

const CATEGORIES = [
  'Whiskey',
  'Wine',
  'Beer',
  'Vodka',
  'Rum',
  'Brandy',
  'Tequila',
  'Tea & Coffee',
  'Soft Drinks',
  'Veg Starters',
  'Egg Starters',
  'Non-Veg Starters',
  'Veg Main Course',
  'Non-Veg Main Course',
  'Roti & Dal',
  'Salad',
  'Tibetan',
  'Pasta',
  'Sandwich',
  'Veg Soup',
  'Non-Veg Soup',
  'Ramen',
  'Mocktails',
  'Cocktails',
  'Rice & Noodles'
];

function MenuManagement() {
  const [menuItems, setMenuItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    available: 1
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch(`${API_URL}/menu`);
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingItem 
        ? `${API_URL}/menu/${editingItem.id}`
        : `${API_URL}/menu`;
      
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      });

      if (response.ok) {
        fetchMenuItems();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      available: item.available
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await fetch(`${API_URL}/menu/${id}`, { method: 'DELETE' });
        fetchMenuItems();
      } catch (error) {
        console.error('Error deleting menu item:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', category: '', price: '', available: 1 });
    setEditingItem(null);
    setShowForm(false);
  };

  const groupedMenu = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Menu Management</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : '+ Add New Item'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-bold mb-4">{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Item Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Price (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Availability</label>
                <select
                  value={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: parseInt(e.target.value) })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value={1}>Available</option>
                  <option value={0}>Not Available</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                {editingItem ? 'Update' : 'Add'} Item
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-6">
          {Object.entries(groupedMenu).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-lg font-bold bg-gray-200 px-4 py-2 rounded uppercase">
                {category}
              </h2>
              <div className="mt-2 space-y-2">
                {items.map(item => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border rounded p-4 hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-blue-600 font-bold">₹{item.price.toFixed(2)}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {item.available ? 'Available' : 'Unavailable'}
                      </span>
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {Object.keys(groupedMenu).length === 0 && (
            <p className="text-gray-500 text-center py-8">No menu items yet. Add your first item!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuManagement;
