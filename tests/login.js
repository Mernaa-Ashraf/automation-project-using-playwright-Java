const fs = require('fs');

async function login(page, email, password) {

  // 🔹 Intercept login API
  const loginResponsePromise = page.waitForResponse(resp =>
    resp.url().includes('/api/v2/user/auth/regular/login') &&
    resp.status() === 200
  );

  await page.goto("http://172.177.136.15/?logged=false");

  await page.getByRole('link', { name: 'Login' }).click();

  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);

  await Promise.all([
    page.waitForURL("**/your-portal", { timeout: 60000 }),
    page.getByRole('button', { name: 'login' }).click()
  ]);

  // 🔹 Extract API token
  const loginResponse = await loginResponsePromise;
  const loginJson = await loginResponse.json();

  const apiToken = loginJson.data.access_token;

  // 🔹 Save API token ONLY for API calls
  fs.writeFileSync(
    './api-token.json',
    JSON.stringify({ apiToken }, null, 2)
  );

  // 🔹 Save UI session (contains codered internally)
  await page.context().storageState({
    path: './user-session.json'
  });

  console.log('✅ API token + UI session saved');
}

module.exports = { login };
