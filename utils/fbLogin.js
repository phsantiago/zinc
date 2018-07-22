const fbLogin = async ({user, pass, page, shouldClosePage = true}) => {
  console.log('start login, ', new Date())
  const ID = {
    login: '#email',
    pass: '#pass'
  };

  await page.goto('https://facebook.com', {
    waitUntil: 'networkidle2'
  });
  await page.waitForSelector(ID.login);
  await page.type(ID.login, user);
  await page.type(ID.pass, pass);
  await page.click("#loginbutton")

  console.log('ended login, ', new Date())
  await page.waitForNavigation();
  if (shouldClosePage) await page.close();
}

module.exports = fbLogin;
