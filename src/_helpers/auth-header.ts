export function authHeader() {
  const user = localStorage.getItem("user");
  if (!user) {
    return {};
  }

  const userp = JSON.parse(user);
  if (userp && userp.token) {
    return { Authorization: "Bearer " + userp.token };
  } else {
    return {};
  }
}
