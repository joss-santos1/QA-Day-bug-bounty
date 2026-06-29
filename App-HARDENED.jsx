import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [page, setPage] = useState('login');
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
  const [dogs, setDogs] = useState([]);
  const [currentDogIndex, setCurrentDogIndex] = useState(0);
  const [matches, setMatches] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [userDog, setUserDog] = useState(null);
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ email: '', password: '', name: '' });
  const [dogForm, setDogForm] = useState({ name: '', age: '', breed: '', bio: '', photo: '' });

  useEffect(() => {
    if (token) {
      setPage('swipe');
      fetchDogs();
      fetchMatches();
    }
  }, [token]);

  // ============ AUTHENTICATION ============

  const clearLoginForm = useCallback(() => {
    setLoginForm({ email: '', password: '' });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await response.json();
      
      if (data.token) {
        setToken(data.token);
        setUserId(data.userId);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        setPage('swipe');
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm)
      });
      const data = await response.json();
      
      if (data.token) {
        setToken(data.token);
        setUserId(data.userId);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        setPage('swipe');
      }
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  // ============ DOG PROFILE ============

  const handleCreateDog = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/dogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: dogForm.name,
          age: parseInt(dogForm.age),
          breed: dogForm.breed,
          bio: dogForm.bio,
          photoUrl: dogForm.photo
        })
      });
      const data = await response.json();
      setUserDog(data);
      setPage('swipe');
    } catch (err) {
      console.error('Failed to create dog profile:', err);
    }
  };

  // ============ FETCHING ============

  const fetchDogs = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/dogs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setDogs(data || []);
      setCurrentDogIndex(0);
    } catch (err) {
      console.error('Failed to fetch dogs:', err);
    }
  }, [token]);

  const fetchMatches = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/matches`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setMatches(data || []);
    } catch (err) {
      console.error('Failed to fetch matches:', err);
    }
  }, [token]);

  // ============ SWIPING ============

  const handleSwipe = useCallback(async (direction) => {
    if (currentDogIndex >= dogs.length) return;

    const targetDog = dogs[currentDogIndex];
    
    try {
      const dogCard = document.querySelector('.dog-card');
      if (dogCard) {
        dogCard.classList.add(direction === 'right' ? 'swipe-right' : 'swipe-left');
      }

      const response = await fetch(`${API_URL}/swipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          targetDogId: targetDog.id,
          direction: direction
        })
      });

      const swipeData = await response.json();
      
      setCurrentDogIndex(currentDogIndex + 1);

      if (currentDogIndex + 1 >= dogs.length) {
        setTimeout(() => {
          setCurrentDogIndex(0);
          fetchDogs();
        }, 500);
      }
    } catch (err) {
      console.error('Swipe failed:', err);
    }
  }, [currentDogIndex, dogs, token, fetchDogs]);

  // ============ UNMATCHING ============

  const handleUnmatch = useCallback(async (matchId) => {
    try {
      await fetch(`${API_URL}/matches/${matchId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchMatches();
    } catch (err) {
      console.error('Unmatch failed:', err);
    }
  }, [token, fetchMatches]);

  // ============ LOGOUT ============

  const handleLogout = () => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setPage('login');
  };

  // ============ UI RENDERING ============

  if (!token) {
    return (
      <div className="auth-container">
        {page === 'login' ? (
          <div className="auth-form">
            <h1>🐕 DogMatch</h1>
            <h2>Find Your Perfect Match</h2>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
              <button type="submit">Login</button>
            </form>
            <p>
              Don't have an account?{' '}
              <button className="link-btn" onClick={() => setPage('register')}>
                Register
              </button>
            </p>
          </div>
        ) : (
          <div className="auth-form">
            <h1>🐕 DogMatch</h1>
            <h2>Join the Pack</h2>
            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Full Name"
                value={registerForm.name}
                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                required
              />
              <button type="submit">Register</button>
            </form>
            <p>
              Already have an account?{' '}
              <button className="link-btn" onClick={() => setPage('login')}>
                Login
              </button>
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <h1 className="logo">🐕 DogMatch</h1>
        <div className="nav-links">
          <button 
            className={`nav-btn ${page === 'swipe' ? 'active' : ''}`}
            onClick={() => setPage('swipe')}
          >
            Swipe
          </button>
          <button 
            className={`nav-btn ${page === 'matches' ? 'active' : ''}`}
            onClick={() => { setPage('matches'); fetchMatches(); }}
          >
            Matches ({matches.length})
          </button>
          <button 
            className={`nav-btn ${page === 'profile' ? 'active' : ''}`}
            onClick={() => setPage('profile')}
          >
            Profile
          </button>
          <button className="nav-btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="page-container">
        {page === 'swipe' && (
          <div className="swipe-page">
            <h2>Discover Dogs Near You</h2>
            {dogs.length > 0 && currentDogIndex < dogs.length ? (
              <div className="swipe-container">
                <div className="dog-card">
                  <img 
                    src={dogs[currentDogIndex].photo_url} 
                    alt={dogs[currentDogIndex].name}
                    className="dog-image"
                  />
                  <div className="dog-info">
                    <h3 className="dog-name">{dogs[currentDogIndex].name}</h3>
                    <p className="dog-age">{dogs[currentDogIndex].age} years old</p>
                    <p className="dog-breed">{dogs[currentDogIndex].breed}</p>
                    <p className="dog-bio">{dogs[currentDogIndex].bio}</p>
                  </div>
                </div>
                <div className="button-container">
                  <button 
                    className="btn btn-reject"
                    onClick={() => handleSwipe('left')}
                  >
                    👎 Pass
                  </button>
                  <button 
                    className="btn btn-like"
                    onClick={() => handleSwipe('right')}
                  >
                    ❤️ Like
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>No more dogs to discover!</p>
                <button className="btn btn-primary" onClick={fetchDogs}>
                  Refresh Dogs
                </button>
              </div>
            )}
          </div>
        )}

        {page === 'matches' && (
          <div className="matches-page">
            <h2>Your Matches</h2>
            {matches.length > 0 ? (
              <div className="matches-grid">
                {matches.map((match) => (
                  <div key={match.id} className="match-card">
                    <img 
                      src={match.photo_url || 'https://via.placeholder.com/200'} 
                      alt={match.name}
                      className="match-image"
                    />
                    <div className="match-details">
                      <h3>{match.name}</h3>
                      <p>{match.age} years • {match.breed}</p>
                      <p className="bio">{match.bio}</p>
                      <button 
                        className="btn btn-small btn-danger"
                        onClick={() => handleUnmatch(match.id)}
                      >
                        Unmatch
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No matches yet. Keep swiping!</p>
              </div>
            )}
          </div>
        )}

        {page === 'profile' && !userDog && (
          <div className="profile-page">
            <h2>Create Your Dog's Profile</h2>
            <form onSubmit={handleCreateDog} className="profile-form">
              <input
                type="text"
                placeholder="Dog's Name"
                value={dogForm.name}
                onChange={(e) => setDogForm({ ...dogForm, name: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Age (years)"
                value={dogForm.age}
                onChange={(e) => setDogForm({ ...dogForm, age: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Breed"
                value={dogForm.breed}
                onChange={(e) => setDogForm({ ...dogForm, breed: e.target.value })}
                required
              />
              <textarea
                placeholder="Tell us about your pup!"
                value={dogForm.bio}
                onChange={(e) => setDogForm({ ...dogForm, bio: e.target.value })}
              />
              <input
                type="url"
                placeholder="Photo URL"
                value={dogForm.photo}
                onChange={(e) => setDogForm({ ...dogForm, photo: e.target.value })}
              />
              <button type="submit" className="btn btn-create">
                Create Profile
              </button>
            </form>
          </div>
        )}

        {page === 'profile' && userDog && (
          <div className="profile-page">
            <h2>Your Dog's Profile</h2>
            <div className="dog-preview">
              <img src={userDog.photo_url} alt={userDog.name} />
              <h3>{userDog.name}</h3>
              <p>{userDog.age} years • {userDog.breed}</p>
              <p>{userDog.bio}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
