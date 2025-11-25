import { test, expect } from '@playwright/test';

test("footer links navigation", async ({ page }) => {

    await page.goto("https://uat-learn.eccouncil.org/?logged=false");


    const trainerLink = page.getByRole('link', { name: 'Trainers' });

    await Promise.all([
        page.waitForURL('https://uat-learn.eccouncil.org/instructors?logged=false'),
        trainerLink.click()
    ]);

     expect(page.url()).toBe("https://uat-learn.eccouncil.org/instructors?logged=false");

    await page.goBack()
    await expect(page).toHaveURL("https://uat-learn.eccouncil.org/?logged=false")
    const privacyLink = page.locator('footer').getByRole('link', { name: 'Privacy Policy' });

//navigating to a new tab in new page 
    const [newPage] = await Promise.all([
     page.waitForEvent("popup"),
      privacyLink.click()
     ]);
    await newPage.waitForLoadState();
    expect(newPage).toHaveURL("https://www.eccouncil.org/legal/privacy-policy/");
});

test('navigate to login and fill credentials', async ({ page }) => {

    await page.goto("http://172.177.136.15/?logged=false");
    const login=page.getByRole('link', { name: 'Login' })
    await Promise.all([
         page.waitForURL("http://172.177.136.15/login?logged=false"),
         login.click()
    ])
   await page.getByRole('textbox', { name: 'Email' }).fill("Talia.Walter@gmail.com")
   await page.getByRole('textbox', { name: 'Password' }).fill("Fadysaber1!")
   const dashboard=await page.getByRole('button',{name:'login'})
   await Promise.all([
        page.waitForURL("http://172.177.136.15/your-portal?logged=true"),
        dashboard.click()
   ])
  await expect(page).toHaveURL("http://172.177.136.15/your-portal?logged=true")
   //await page.pause();
})