import { test, expect } from "@playwright/test";

const competitionName = 'Competition new';
test.use({
    viewport: { width: 1590, height: 1215 }
});
test("Competition", async ({ page }) => {


    // login page
    await page.goto('http://20.1.140.13/auth/login', { waitUntil: 'domcontentloaded' });

    await page.fill('#default-input', 'cady@mailinator.com');
    await page.fill('input[type="password"]', 'Fadysaber1!');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await page.waitForURL('**/profile-selection', { timeout: 10000 });

    // SELECT FIRST ORGANIZATION
    await page.waitForLoadState('networkidle');
    await page.locator('ul li button span').first().click();

    await page.waitForLoadState('networkidle');

    // GO TO COMPETITIONS TAB
    // -------------------------
    await page.getByRole('link', { name: 'Competitions' }).click();
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Create a new Competitions' }).click();
    await page.getByRole('textbox', { name: 'e.g. Introduction to' }).fill(competitionName);
    await page.getByRole('button', { name: 'Next' }).click();
    await page.waitForLoadState('networkidle');
    const comp = page.getByRole('button', { name: 'Select' }).nth(1)
    await expect(comp).toBeVisible();
    await comp.click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.waitForLoadState('networkidle');
    await page.locator('div:nth-child(4) > .text-center > div:nth-child(4) > ngx-skeleton-loader').waitFor({ state: 'hidden' })
    await page.waitForLoadState('load');
    const users = page.getByText('Eleanor Robles cady@')
    await users.waitFor({ state: 'visible' });

    // Now you can interact with it safely
    await users.click();
    const confirmButton = page.getByRole('button', { name: 'Confirm' });


    await expect(confirmButton).toBeVisible();
    await expect(confirmButton).toBeEnabled({ timeout: 10000 });
    await confirmButton.click();



    /*
    const actionsButton = page.locator('i').first() // adjust selector if needed
    await actionsButton.click();
  
    // 
    const firstAction = page.getByRole('menuitem', { name: 'View Competition' }); // adjust selector if needed
    await firstAction.hover();
  
    // Click the 'View' action
    await firstAction.click();
  
    // Wait for the navigation to the view page
    await page.waitForURL('**overview page url', { timeout: 10000 });
  
    // Capture the URL and extract competition ID
    const competitionUrl = page.url();
    const competitionId = competitionUrl.split('/')[5]; // index 5 is the UUID
    console.log("Competition ID:", competitionId);
    const response = await request.post(
    "http://20.1.140.13:8080/api/v1/user/store-organization-user?organization_id=29ca83f9-69db-4683-a0dd-c11de3974288",
  {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer TOKEN"  },
    data: payload
  }
  );*/
    //create new user & assign created competition to user
    await page.getByRole('link', { name: 'Users' }).click()
    await page.getByRole('button', { name: 'Add New Users image' }).click()
    const addnewUser = page.getByRole('menuitem', { name: 'user icon Add Users Manually' })
    await addnewUser.hover()
    await addnewUser.click()

    const fisrtname = "Ahmed";
    const lastname = "newUser";
    const email = "nekeja@mailinator.com"
    await page.getByRole('textbox', { name: 'First Name' }).fill(fisrtname)
    await page.getByRole('textbox', { name: 'Last Name' }).fill(lastname)
    await page.getByRole('textbox', { name: 'Email' }).fill(email)
    await page.locator('.ng-arrow-wrapper').first().click()
    const Role = page.getByRole('option', { name: 'User' })
    await Role.hover()
    await Role.click()
    await page.locator('div:nth-child(3) > .select').click()

    //wait untill all comp returned 
    await page.waitForLoadState("networkidle")
    await page.locator('.groups__select > .ng-select-multiple > .ng-select-container > .ng-arrow-wrapper').click()
    await page.getByText(competitionName).click();
    await page.locator('ng-select').filter({ hasText: 'Select Competition×Test' }).getByRole('combobox').click()
    await page.getByRole('button', { name: 'Add user' }).click()


    const newPage = await page.context().newPage();
    await newPage.goto("http://172.177.136.15/login", {
        waitUntil: "domcontentloaded",
        timeout: 60000
    });
    await newPage.getByRole('textbox', { name: 'Email' }).fill(email);
    await newPage.getByRole('textbox', { name: 'Password' }).fill("Fadysaber1!");


    const dashboardBtn = newPage.getByRole('button', { name: 'login' });

    dashboardBtn.click()
    await newPage.locator('xpath=/html/body/app-root/mat-sidenav-container/mat-sidenav/div/div/div[2]/a[11]/div/span').click()
    await newPage.locator("xpath=/html/body/app-root/mat-sidenav-container/mat-sidenav-content/main/div/app-your-portal/section/div/div/app-competitions/div/div[1]/div[1]/div[2]/h5").click()
    //ait newPage.waitForLoadState('networkidle')
    // Validate assigned competition exists
    const assignedCompetition = newPage.getByText(competitionName, { exact: true });

    // Use expect inside try/catch if you want a custom message
    try {
        await expect(assignedCompetition).toBeVisible();
        console.log(`Competition "${competitionName}" is assigned to this user`);
    } catch (error) {
        console.log(` Competition "${competitionName}" is NOT visible for this user.`);
        throw error; // optional: re-throw to fail the test
    }
});