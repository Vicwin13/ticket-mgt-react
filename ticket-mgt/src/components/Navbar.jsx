import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="">
      
            <h1 className="font-bold text-gray-800 margin-[0rem] tixily">Tixily</h1>
          
          <div className="flex items-center  gap-[1rem]  ">
            <Link
              to="/login"
              className="login py-[10px] bg-[#ffd700]   px-[15px] rounded-[8px] cursor-pointer transition-colors"
              >
              Login
            </Link>
           
            <button className="started" onClick={handleGetStarted}>
              Get Started
            </button>
          </div>
   
      
    </nav>
  );
};

export default Navbar;