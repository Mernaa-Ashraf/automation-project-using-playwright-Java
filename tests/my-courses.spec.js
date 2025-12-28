const { test, expect, chromium } = require('@playwright/test');
const { login } = require('./login');
const fs = require('fs');

const STORAGE_FILE = './user-session.json';
const EMAIL = 'kamalelshenawy@test.com';
const PASSWORD = 'Fadysaber1!';

test('Navigate to My Courses using saved session', async ({ browser }) => {
    let context;

    if (fs.existsSync(STORAGE_FILE)) {
        // Reuse session from previous login
        context = await browser.newContext({ storageState: STORAGE_FILE });
    } else {
        // First time: create new context and login
        context = await browser.newContext();
        const page = await context.newPage();
        await login(page, EMAIL, PASSWORD, STORAGE_FILE);
    }

    const page = await context.newPage();

    // Navigate to My Courses tab
    await page.goto('http://172.177.136.15/your-portal'); // dashboard page
    const courses = page.locator('//*[@id="overflow-parent"]/app-courses/div/div[1]/div/app-dashboard-header/section/section[1]/header/h2/span');
    await courses.click();
    await expect(courses).toBeVisible();
});
