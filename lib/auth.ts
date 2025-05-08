export const checkAuthStatus = (): boolean => {
  // Check localStorage for user data
  const userData = localStorage.getItem("user");
  if (userData) {
    try {
      const user = JSON.parse(userData);
      return Boolean(user && user.id);
    } catch (e) {
      // Invalid JSON in localStorage
      return false;
    }
  }
  // Check for authentication cookie as fallback
  const cookies = document.cookie.split(";");
  const authCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("authToken=")
  );

  return Boolean(authCookie);
};
