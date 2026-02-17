import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import POSPage from './pages/POSPage';
import MenuManagement from './pages/MenuManagement';
import OrderHistory from './pages/OrderHistory';

function App() {
  return (
    <Router>
      <div 
        className="min-h-screen bg-gray-100 relative flex flex-col"
        style={{
          backgroundImage: 'url(/data/logo.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-white bg-opacity-70 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col min-h-screen">
          <nav className="bg-blue-600 text-white shadow-lg no-print">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-8">
                  <h1 className="text-xl font-bold">Downtown Restro & Bar</h1>
                  <div className="flex space-x-4">
                    <Link to="/" className="hover:bg-blue-700 px-3 py-2 rounded">
                      Billing
                    </Link>
                    <Link to="/menu" className="hover:bg-blue-700 px-3 py-2 rounded">
                      Menu Management
                    </Link>
                    <Link to="/history" className="hover:bg-blue-700 px-3 py-2 rounded">
                      Order History
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<POSPage />} />
              <Route path="/menu" element={<MenuManagement />} />
              <Route path="/history" element={<OrderHistory />} />
            </Routes>
          </div>
          
          {/* Footer - Always at bottom */}
          <footer className="bg-gray-800 text-white py-4 mt-auto no-print">
            <div className="container mx-auto px-4 text-center text-sm">
              <p>
                Developed by{' '}
                <a 
                  href="https://github.com/nishankuprety" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Nishank Uprety
                </a>
                {' | '}
                <a 
                  href="mailto:nishankuprety@gmail.com"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  nishankuprety@gmail.com
                </a>
              </p>
            </div>
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;
