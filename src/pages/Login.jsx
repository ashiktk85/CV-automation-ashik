import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axiosInstance.post('/api/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', email);
        toast.success('Login successful');
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Login failed');
        toast.error(response.data.message || 'Login failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      <div className="w-1/3 h-screen">
        <img
          src="https://images.pexels.com/photos/15539377/pexels-photo-15539377.jpeg"
          alt="side"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-3/4 h-screen flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-center text-3xl font-bold text-gray-900">
              ADMIN LOGIN
            </h2>
            <p className="mt-1 text-center text-sm text-gray-600">
              Sign in with your admin credentials
            </p>
          </div>

          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div className="relative mb-10">
                <input
                  id="email"
                  name="email"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" "
                  className="
      peer block w-full px-3 py-3
      border-0 border-b border-gray-300
      focus:border-blue-500
      focus:outline-none
      transition text-2xl bg-transparent
    "
                />

                <label
                  htmlFor="email"
                  className="
      absolute left-3 top-3 text-gray-500 text-xl
      transition-all duration-200 pointer-events-none

      /* When input is empty */
      peer-placeholder-shown:top-3
      peer-placeholder-shown:text-xl

      /* When input has value */
      peer-[&:not(:placeholder-shown)]:-top-2
      peer-[&:not(:placeholder-shown)]:text-sm

      /* When focused */
      peer-focus:-top-2
      peer-focus:text-sm
    "
                >
                  Email
                </label>
              </div>


              <div className="relative mb-10">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" "
                  className="
      peer block w-full px-3 py-3
      border-0 border-b border-gray-300
      focus:border-blue-500
      focus:outline-none
      transition text-2xl bg-transparent
    "
                />

                <label
                  htmlFor="password"
                  className="
      absolute left-3 top-3 text-gray-500 text-xl
      transition-all duration-200 pointer-events-none

      peer-placeholder-shown:top-3
      peer-placeholder-shown:text-xl

      peer-[&:not(:placeholder-shown)]:-top-2
      peer-[&:not(:placeholder-shown)]:text-sm

      peer-focus:-top-2
      peer-focus:text-sm
    "
                >
                  Password
                </label>
              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="
          w-full py-2 px-4 text-white py-4
          bg-[#133a5b] hover:bg-[#133a5b]/80
          rounded-md font-medium shadow
          disabled:opacity-50 cursor-pointer
        "
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div >


    </div >
  );
};

export default Login;