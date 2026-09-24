export default {
  testDir: ".",
  timeout: 120000,
  expect: { timeout: 20000 },
  reporter: [["list"]],
  use: { baseURL: process.env.BASE || "http://127.0.0.1:8731", headless: true },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
};
