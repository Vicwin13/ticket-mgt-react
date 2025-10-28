import Navbar from './Navbar.jsx';

const Home = () => {
  return (
    <div className="home">
      <Navbar />

       <div>

         <h1 className='support'>Where Support Meets
            <span className='simple'>

            Simplicity
          </span>
          </h1>
      </div>

      
       <div class="decorative-shapes">
      
      <svg class="shape circle-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" fill="#0066FF" opacity="0.1" />
        <circle cx="50" cy="50" r="30" fill="#0066FF" opacity="0.2" />
        <circle cx="50" cy="50" r="20" fill="#0066FF" opacity="0.3" />
      </svg>

      
      <svg class="shape triangle-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <polygon points="50,10 90,90 10,90" fill="#0066FF" opacity="0.15" />
      </svg>

      
      <svg class="shape hexagon-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="#0066FF" opacity="0.12" />
      </svg>

      
      <svg class="shape square-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect
          x="20"
          y="20"
          width="60"
          height="60"
          fill="#0066FF"
          opacity="0.1"
          transform="rotate(45 50 50)"
        />
      </svg>

      
      <svg class="shape star-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <polygon
          points="50,10 61,35 88,35 66,52 77,78 50,60 23,78 34,52 12,35 39,35"
          fill="#0066FF"
          opacity="0.2"
        />
      </svg>

      
      <svg class="shape blob-1" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M40,40 Q60,20 80,40 T120,40 Q140,60 120,80 T120,120 Q100,140 80,120 T40,120 Q20,100 40,80 T40,40"
          fill="#00663F"
          opacity="0.08"
        />
      </svg>
    </div>
      



    </div>
  );
};

export default Home;