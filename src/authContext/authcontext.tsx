import{ createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosinstance/Axiosinstance';
interface User
{
  username: string;
  email: string;
  password: string;
}
interface login
{
  email: string;
  password: string;
}
interface AuthContextType{
  userlogin: login | null,
  user: User | null,
  login: (userDatalogin : login) => Promise<void>
  // refreshToken: () => Promise<void>
  signup: (userDate : User) => Promise<void>
  logout: () => void
  authStatus:{
    isloading: boolean;
    iserror: boolean;
    issuccess: boolean;
    message: string | null;
  }
  clearAuthStatus: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [userlogin , setuserlogin] = useState<login | null>(null)
  let [authStatus , setauthstatus] = useState({
    isloading: false,
    iserror: false,
    issuccess: false,
    message: "",
  })
  let navigate = useNavigate()
  const clearAuthStatus = () => {
    setauthstatus({
      isloading: false,
      issuccess: false,
      iserror: false,
      message: ""
    });
  };
  const signup = async (userData:User ) => {
    try {
      // Set loading state
      setauthstatus({
        isloading: true,
        iserror: false,
        issuccess: false,
        message: "Creating account...",
      });

      // Use axiosInstance for relative URLs (goes through nginx proxy, no CORS issues)
      let response = await axiosInstance.post('/api/signup', userData)
      console.log("response", response)

      if(response.data.message === "user created") {
        console.log("user created")
        setUser(userData);
        setauthstatus({
          isloading: false,
          iserror: false,
          issuccess: true,
          message: "Account created successfully!",
        });
        // Navigate to login page after successful signup
        navigate("/login", {replace: true});
      } else {
        setauthstatus({
          isloading: false,
          iserror: true,
          issuccess: false,
          message: "Failed to create account",
        });
      }
    }
    catch (error: any) {
      console.log(error);
      setauthstatus({
        isloading: false,
        iserror: true,
        issuccess: false,
        message: error.response?.data?.message || "Failed to create account",
      });
    }
  };
  const login =async (userDatalogin: login) => {
    try{
    // const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    setauthstatus({
      isloading: true,
      iserror: false,
      issuccess: false,
      message: "logging in...",
    })
    let response = await axiosInstance.post(`/api/login`, userDatalogin)
    // if(response)
    //   {
    //     alert("login success")
    //   }
    console.log("response", response)
    localStorage.setItem("token", response.data.token)
    localStorage.setItem("refreshToken", response.data.refreshToken)
    navigate("/" , {replace: true})
    setuserlogin(userDatalogin);
    setauthstatus({
      isloading: false,
      iserror: false,
      issuccess: true,
      message: "login success",
    })
  }
  catch (error) {
    setauthstatus({
      isloading: false,
      iserror: true,
      issuccess: false,
      message: "login failed",
    })
  }
  };

  // let refreshToken = async () => {
  //   try {
  //     const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  //     const refreshToken = localStorage.getItem("refreshToken");
  //     if (!refreshToken) {
  //       throw new Error("No refresh token found");
  //     }
  //     const response = await axios.post(`${apiUrl}/api/refreshtoken`, { token: refreshToken });
  //     localStorage.setItem("token", response.data.token);
  //     console.log("Token refreshed successfully");
  //   } catch (error) {
  //     console.error("Failed to refresh token:", error);
  //     localStorage.removeItem("token");
  //     localStorage.removeItem("refreshToken");
  //     navigate("/login", { replace: true });
  //   }
  // }

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{userlogin, user, login, logout, signup , authStatus, clearAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};