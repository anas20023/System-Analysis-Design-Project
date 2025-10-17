import Cookies from "js-cookie";
import axios from "axios";

export const saveToken = (token) => {
  const expiryTime = new Date().getTime() + 5 * 60 * 60 * 1000; // 5h in ms

  Cookies.set("authToken", token, {
    expires: 5 / 24,
    secure: true,
    sameSite: "Strict",
  });
  Cookies.set("authTokenExpiry", expiryTime.toString(), {
    expires: 5 / 24,
    secure: true,
    sameSite: "Strict",
  });
};

export const getToken = () => Cookies.get("authToken");
export const getTokenExpiry = () => Cookies.get("authTokenExpiry");


export const isTokenValid = () => {
  const token = Cookies.get("authToken");
  const expiry = Cookies.get("authTokenExpiry");

  if (!token || !expiry) return false;

  const now = new Date().getTime();
  if (now > parseInt(expiry)) {
    // expired → remove
    removeToken();
    localStorage.removeItem("userinfo");
    return false;
  }

  return true;
};

export const removeToken = () => {
  Cookies.remove("authToken");
  Cookies.remove("authTokenExpiry");
};
export const checkAuth = async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/auth/check", {
      withCredentials: true,
    });
    return res.data; 
  } catch (e) {
    console.log(e);
    removeToken();
    window.location.href = "/login";
    return null;
  }
}