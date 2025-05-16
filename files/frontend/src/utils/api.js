const API = "http://localhost:4000/api";
export default {
  register: data => fetch(`${API}/register`, { method: "POST", body: JSON.stringify(data), headers: { "Content-Type":"application/json" }, credentials: "include" }).then(r=>r.json()),
  login: data => fetch(`${API}/login`, { method: "POST", body: JSON.stringify(data), headers: { "Content-Type":"application/json" }, credentials: "include" }).then(r=>r.json()),
  // ...altre chiamate
};