import { Link, useLocation } from 'react-router-dom';

const NavLink = ({ to, children, className = '' }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  const combinedClassName = `nav-link ${className} ${isActive ? 'active' : ''}`;
  
  return (
    <Link to={to} className={combinedClassName}>
      {children}
    </Link>
  );
};

export default NavLink;