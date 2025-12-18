async function login(page, email, password) { 
  await page.goto("http://172.177.136.15/?logged=false");

  const loginLink = page.getByRole('link', { name: 'Login' });
  await Promise.all([
    page.waitForURL("http://172.177.136.15/login?logged=false",{ timeout: 60000 }),
    loginLink.click()
  ]);

  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);

  const dashboardBtn = page.getByRole('button', { name: 'login' });
  await Promise.all([
    page.waitForURL("http://172.177.136.15/your-portal?logged=true",{ timeout: 60000 }),
    dashboardBtn.click()
  ]);
}

module.exports = { login };
