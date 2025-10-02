import Cookies from "js-cookie";


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
    return false;
  }

  return true;
};

export const removeToken = () => {
  Cookies.remove("authToken");
  Cookies.remove("authTokenExpiry");
};
