import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1 className='text-[red]'>Hello, Welcome</h1>
      {/* Link to the desired route */}
      <Link to="/certificate">
        <button>Go to Certificates</button>
      </Link>
    </div>
  );
}

export default Home;
