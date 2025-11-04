import { useContext, useState } from "react"
import AuthContext from "../authContext/authcontext"
import { Link } from "react-router-dom"

const Signup = () => {

  let [input, setInput] = useState({
    username: "",
    email: "",
    password: ""
  })

  // Validation state
  const [isEmailValid, setIsEmailValid] = useState(false);

  // Email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  };

  let handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({...prev, [name]: value}))

    // Validate email on change
    if (name === 'email') {
      setIsEmailValid(validateEmail(value));
    }
  }

  let handlesubmit = (e:any) => {
    e.preventDefault()
    auth?.signup(input)
  }

  let auth = useContext(AuthContext)

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel - Decorative */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-500 to-pink-500 p-12 flex-col justify-between">
        <div className="text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome to MovieApp</h1>
          <p className="text-lg opacity-80">Discover thousands of movies and TV shows.</p>
        </div>
        <div className="text-white/70 text-sm">
          © 2024 MovieApp. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Sign Up Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-2 text-gray-600">Join our community of movie enthusiasts</p>
          </div>

          {/* Show error message if authentication failed */}
          {auth?.authStatus?.iserror && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md border-l-4 border-red-500">
              {auth.authStatus.message}
            </div>
          )}

          {/* Show success message if needed */}
          {auth?.authStatus?.issuccess && (
            <div className="bg-green-50 text-green-600 p-4 rounded-md border-l-4 border-green-500">
              {auth.authStatus.message}
            </div>
          )}

          <form className="mt-8 space-y-6">
            <div className="space-y-5">
              <div>
                <div className="relative">
                  <input
                    id="username"
                    className="peer w-full px-4 py-3 border-b-2 border-gray-300 placeholder-transparent focus:outline-none focus:border-purple-500 transition-colors"
                    type="text"
                    placeholder="Username"
                    value={input.username}
                    onChange={handlechange}
                    name="username"
                  />
                  <label
                    htmlFor="username"
                    className="absolute left-4 -top-5 text-sm text-gray-600 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 transition-all peer-focus:-top-5 peer-focus:text-sm peer-focus:text-purple-500"
                  >
                    Username
                  </label>
                </div>
              </div>

              <div>
                <div className="relative">
                  <input
                    id="email"
                    className="peer w-full px-4 py-3 border-b-2 border-gray-300 placeholder-transparent focus:outline-none focus:border-purple-500 transition-colors"
                    type="email"
                    placeholder="Email"
                    value={input.email}
                    onChange={handlechange}
                    name="email"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-4 -top-5 text-sm text-gray-600 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 transition-all peer-focus:-top-5 peer-focus:text-sm peer-focus:text-purple-500"
                  >
                    Email
                  </label>
                </div>
              </div>

              <div>
                <div className="relative">
                  <input
                    id="password"
                    className="peer w-full px-4 py-3 border-b-2 border-gray-300 placeholder-transparent focus:outline-none focus:border-purple-500 transition-colors"
                    type="password"
                    placeholder="Password"
                    value={input.password}
                    onChange={handlechange}
                    name="password"
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-4 -top-5 text-sm text-gray-600 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 transition-all peer-focus:-top-5 peer-focus:text-sm peer-focus:text-purple-500"
                  >
                    Password
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={handlesubmit}
              className={`w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-full hover:opacity-90 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ${
                !isEmailValid || !input.password || !input.username || auth?.authStatus?.isloading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {auth?.authStatus?.isloading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-500 hover:text-purple-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
