const assert = require('chai').assert;
const {Builder, By, until, Key} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const {Options} = require('selenium-webdriver/chrome');

describe('Steam Store', function() {
  let driver;
  this.timeout(30000);

  before(async function() {
    let options = new Options();
    options.addArguments('incognito');
    options.setAcceptInsecureCerts(true);
    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  });

  after(async function() {
    await driver.quit();
  });

  it('should navigate to Privacy Policy page', async function() {
    await driver.get('https://store.steampowered.com/');
    await driver.findElement(By.linkText('Privacy Policy')).click();

    // Wait until a new window/tab is opened
    await driver.wait(async function() {
      const handles = await driver.getAllWindowHandles();
      return handles.length === 2;
    }, 10000);

    // Switch to the new window/tab
    const handles = await driver.getAllWindowHandles();
    await driver.switchTo().window(handles[1]);

    // Wait until the URL contains 'privacy_agreement'
    await driver.wait(until.urlContains('privacy_agreement'), 10000);

    // Check if the URL contains 'privacy'
    const url = await driver.getCurrentUrl();
    assert.include(url, 'privacy', 'Privacy Policy page not opened');
  });

it('should search for Dota 2', async function() {
  await driver.get('https://store.steampowered.com/');
  await driver.findElement(By.id('store_nav_search_term')).sendKeys('Dota 2', Key.RETURN);
  await driver.wait(until.urlContains('term=Dota+2'), 10000);
  const searchTerm = await driver.findElement(By.id('term')).getAttribute('value');
  assert.strictEqual(searchTerm, 'Dota 2', 'Search box does not contain searched term');

  const titles = await driver.findElements(By.css('.search_result_row .title'));
  assert.isNotEmpty(titles, 'No search results found');
  const firstTitle = await titles[0].getText();
  assert.include(firstTitle, 'Dota 2', 'First search result does not match search term');
});

});