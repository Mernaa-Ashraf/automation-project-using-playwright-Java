const fs = require('fs');

async function login(page, email, password, storageFile = './user-session.json') {
   
    await page.goto("http://172.177.136.15/?logged=false");

    const loginLink = page.getByRole('link', { name: 'Login' });
    await Promise.all([
        page.waitForURL("**/login", { timeout: 60000 }),
        loginLink.click()
    ]);
    await page.getByRole('textbox', { name: 'Email' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);

    
    const dashboardBtn = page.getByRole('button', { name: 'login' });
    await Promise.all([
        page.waitForURL("**/your-portal", { timeout: 60000 }),
        dashboardBtn.click()
    ]);
    //Save session (cookies + localStorage) to file
    await page.context().storageState({ path: storageFile });

    console.log(`Session saved to ${storageFile}`);
}

module.exports = { login };
