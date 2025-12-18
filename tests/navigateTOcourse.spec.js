const { test, expect } = require('@playwright/test');
const { login } = require('./login');

test('Navigate to course after login', async ({ page }) => {
  await login(page, 'kamalelshenawy@test.com', 'Fadysaber1!');
  
  const courses = page.locator('//*[@id="overflow-parent"]/app-courses/div/div[1]/div/app-dashboard-header/section/section[1]/header/h2/span');
  await courses.click();
}, 60000); 
