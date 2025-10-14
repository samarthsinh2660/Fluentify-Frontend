
export async function login(role, email, password) {
  const res = await fetch(`/api/auth/login/${role}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  return { status: res.status, data };
}

export async function signup(role, name, email, password) {
  const res = await fetch(`/api/auth/signup/${role}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  return { status: res.status, data };
}

export async function getProfile(token) {
  const res = await fetch('/api/auth/profile', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await res.json();
  return { status: res.status, data };
}
