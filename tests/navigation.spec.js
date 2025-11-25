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
    await expect(page).toHaveURL('https://uat-learn.eccouncil.org/?logged=false');

    const privacylink= page.locator('footer').getByRole('link', { name: 'Privacy Policy' })
//navigating to a new tab
   const [pagenew]= await Promise.all([
      page.waitForEvent("popup"),
      privacylink.click()
    ])
    await pagenew.waitForLoadState();
    await expect(pagenew).toHaveURL("https://www.eccouncil.org/legal/privacy-policy/");


});

test('navigate to login and fill credentials', async ({ page }) => {

    await page.goto("https://uat-learn.eccouncil.org/?logged=false");
    const login=page.getByRole('link', { name: 'Login' })
    await Promise.all([
         page.waitForURL("https://uat-learn.eccouncil.org/login?logged=false"),
         login.click()
    ])
   await page.getByRole('textbox', { name: 'Email' }).fill("fadi_ecl_demo@eccouncil.org")
   await page.getByRole('textbox', { name: 'Password' }).fill("Fadysaber1!")
   const dashboard=await page.getByRole('button',{name:'login'})
   await Promise.all([
        page.waitForURL("https://uat-learn.eccouncil.org/your-portal?logged=true"),
        dashboard.click()
   ])
   expect(page).toHaveURL("https://uat-learn.eccouncil.org/your-portal?logged=true")
   //await page.pause();


})