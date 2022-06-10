// experimental
export function updateToken(newt: string) {
  const user = localStorage.getItem("user");
  if (!user) {
    throw "could not update token - not authenticated";
  }

  const userp = JSON.parse(user);
  if (userp && userp.token) {
    userp.token = newt;
    localStorage.setItem("user", JSON.stringify(userp));
  }
}
