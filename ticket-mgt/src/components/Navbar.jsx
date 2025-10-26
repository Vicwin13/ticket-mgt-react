import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="">
      
        <div className="flex justify-between border-2 w-full items-center">
          
          <div className="flex items-center border-2">
            <h1 className="font-bold text-gray-800">Tixily</h1>
          </div>
          
        
          <div className="flex items-center  justify-between gap-4 w-[10rem]  ">
            <button>
              
            <Link
              to="/login"
              className="text-gray-600 hover:text-gray-800 font-medium py-2 px-4 rounded transition-colors"
              >
              Login
            </Link>
              </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors">
              Get Started
            </button>
          </div>
        </div>
      
    </nav>
  );
};

export default Navbar;