
const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
    
    await page.goto('https://alugrade-lanka-business-management-system.vercel.app/app.html#/quotations', { waitUntil: 'networkidle2' });
    
    // Set localStorage session
    await page.evaluate(() => {
        localStorage.setItem('alugrade_session', JSON.stringify({ user: { email: 'admin@alugrade.lk', name: 'Admin User' } }));
    });
    
    await page.goto('https://alugrade-lanka-business-management-system.vercel.app/app.html#/quotations', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(2000);
    
    const html = await page.content();
    console.log('LIVE PAGE TITLE:', await page.title());
    console.log('LIVE SCRIPT TAGS:');
    const scripts = await page.evaluate(() => Array.from(document.querySelectorAll('script')).map(s => s.src));
    console.log(scripts);
    
    // Click New Quotation button
    const buttons = await page.('button');
    for (let btn of buttons) {
        const text = await page.evaluate(el => el.innerText, btn);
        if (text && text.includes('New Quotation')) {
            console.log('Found New Quotation button! Clicking...');
            await btn.click();
            await page.waitForTimeout(1000);
            break;
        }
    }
    
    const formHtml = await page.evaluate(() => {
        const table = document.getElementById('q_itemsTable');
        return table ? table.outerHTML : 'TABLE NOT FOUND';
    });
    
    console.log('LIVE TABLE HTML:');
    console.log(formHtml);
    
    await page.screenshot({ path: 'live_vercel_actual_dom.png', fullPage: true });
    await browser.close();
})();
