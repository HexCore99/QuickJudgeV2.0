const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); // Fake wait natok

const demoUsers = [
  {
    id: "student-1",
    name: "Student Demo",
    email: "student@quickjudge.dev",
    password: "123456",
    role: "student",
  },
  {
    id: "admin-1",
    name: "Admin Demo",
    email: "admin@quickjudge.dev",
    password: "123456",
    role: "admin",
  },
];

export async function loginApi(credentials) {
  await wait(700);
  const { email, password } = credentials;
  const foundUser = demoUsers.find(
    (user) => user.email === email && user.password === password,
  );
  if (!foundUser) {
    throw new Error("Invalid email or password");
  }

  return {
    user: {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
    },
    token: `mock-token-${foundUser.role}`,
  };
}

export async function signupApi(payload) {
  await wait(800);
  const { name, email, password } = payload;
  if (!name || !email || !password) {
    throw new Error("Please fill in all required fileds.");
  }

  if (password.length < 6) {
    //Apadoto kisu korar dorkar nai
  }

  return {
    user: {
      id: crypto.randomUUID(),
      name,
      email,
      role: "student",
    },
    token: "mock-token-student",
  };
}
