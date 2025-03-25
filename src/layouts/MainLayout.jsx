import { Outlet, Link } from 'react-router-dom';

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-5 flex justify-between items-center">
          <h1 className="text-xl font-bold m-0">Contract Generator</h1>
          <nav>
            <ul className="flex space-x-6">
              <li><Link to="/" className="text-white hover:text-gray-300 transition-colors">Home</Link></li>
              <li><Link to="/modelos" className="text-white hover:text-gray-300 transition-colors">Modelos</Link></li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-5">
          <Outlet />
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-4 text-center">
        <div className="container mx-auto px-5">
          <p className="m-0">&copy; {new Date().getFullYear()} Contract Generator. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout; 