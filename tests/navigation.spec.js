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

test.only('navigate to login and fill credentials', async ({ page }) => {

    await page.goto("http://172.177.136.15/?logged=false");
    const login=page.getByRole('link', { name: 'Login' })
    await Promise.all([
         page.waitForURL("http://172.177.136.15/login?logged=false"),
         login.click()
    ])
   await page.getByRole('textbox', { name: 'Email' }).fill("newadmin2@gmail.com")
   await page.getByRole('textbox', { name: 'Password' }).fill("Fadysaber1!")
   const dashboard=page.getByRole('button', { name: 'login' })
   await Promise.all([
        page.waitForURL("http://172.177.136.15/your-portal?logged=true"),
        dashboard.click()
   ])
   //await page.route('http://172.177.136.15:8080/api/v2/user/profile/pro-dashboard', route => route.abort());
   await page.waitForLoadState('networkidle')
   await expect(page).toHaveURL("http://172.177.136.15/your-portal?logged=true")
   //await page.pause();
   const days=  page.getByRole('radio', { name: 'Learn 2 days a week' })
   try {
    if (await days.isVisible()) {
        console.log("Element found, performing action...");
        await days.check();
        await page.getByRole('button', { name: 'Set Your Weekly Goal' }).click()
        
    }
  } catch (e) {
    console.log("❌ Element not found, skipping...");
  }
   const timeInput = page.locator('input[name="selectedTimeFrom"]');
   await page.waitForLoadState('networkidle')
   try {
    if (await timeInput.isVisible()) {
        console.log("Element found, performing action...");
        await page.getByText('Tu', { exact: true }).click()
        await page.getByText('Mo', { exact: true }).click()
        // await timeInput.check();

  //await page.getByText('Item').click({ position: { x: 1457, y: 432} });
  //const time=String(Math.floor(Math.random()*2)).padStart()

  // Wait until input is ready
        await timeInput.waitFor({ state: 'visible' });

// Generate random hour according to 12-hour system
       let hour = Math.floor(Math.random() * 12) + 1;   // 1–12
       let minute = Math.floor(Math.random() * 60);     // 0–59

// Generate AM or PM randomly
        const isPM = Math.random() < 0.5;

// Convert to 24-hour if needed
        if (isPM && hour !== 12) hour += 12;
        if (!isPM && hour === 12) hour = 0;

// Format to HH:MM
        const randomTime = 
        String(hour).padStart(2, '0') + ':' + 
        String(minute).padStart(2, '0');

        await timeInput.fill(randomTime);
        
        
    }
  } catch (e) {
    console.log("❌ Element not found, skipping...");
  }



   const timeTOInput = page.locator('input[name="selectedTimeTo"]');
   try {
    if (await timeTOInput.isVisible()) {
        console.log("Element found, performing action...")
        //await timeTOInput.check();
        
        //TO TIME

// Wait until input is ready
        await timeTOInput.waitFor({ state: 'visible' });

// Generate random hour according to 12-hour system
       let hour2 = Math.floor(Math.random() * 12) + 1;   // 1–12
       let minute2 = Math.floor(Math.random() * 60);     // 0–59

// Generate AM or PM randomly
        const isPM2 = Math.random() < 0.5;

// Convert to 24-hour if needed
        if (isPM2 && hour2 !== 12) hour2 += 12;
        if (!isPM2 && hour2 === 12) hour2 = 0;

// Format to HH:MM
      const randomTime2 = 
      String(hour2).padStart(2, '0') + ':' + 
      String(minute2).padStart(2, '0');

// Fill time
      await timeTOInput.fill(randomTime2);
      await page.getByRole('button', { name: 'Add To Calendar' }).click()

    }
  } catch (e) {
    console.log("❌ Element not found, skipping...");
  }
  const google= page.locator("#atcb-btn-custom-google")
    try{
    if (await google.isVisible()){
     const [newPage2] = await Promise.all([,
     page.waitForEvent("popup"),
      google.click()
     ]);
      //await newPage2.waitForLoadState();
      await newPage2.close()
    } 
  }
    catch(e){
      console.log("❌ Element not found, skipping...");
    }
    //expect(newPage2).toHaveURL("https://calendar.google.com/calendar/u/0/r/eventedit?
    //dates=20251124T000000/20251124T000000&ctz=Africa/Cairo&text=Weekly+Target&recur=RRULE:
    //FREQ%3DWEEKLY;WKST%3DMO;BYDAY%3DTH,FR,TU&uid=4ff2815b-9fd7-4335-934c-6228e26f8b06");
    
});