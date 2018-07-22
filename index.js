require('dotenv').config()
const puppeteer = require('puppeteer');
const fbLogin = require('./utils/fbLogin');
const sender = require('./utils/mailer');

const sleep = ({sec}) => new Promise(res => setTimeout(res, sec * 1000))

const checkRelationship = async ({ fbId, page }) => {
  await page.goto(`https://www.facebook.com/${fbId}/about?section=relationship`);
  const isInRelationship = !!(await page.content()).match(/relacionamento sério/gi);
  await page.close();
  return isInRelationship;
}

(async () => {
  const browser = await puppeteer.launch({args: ['--no-sandbox'], headless: true});

  await fbLogin({
    user: process.env.USER_FBID,
    pass: process.env.USER_FBPASS,
    page: await browser.newPage()
  });

  const sendMail = sender({
    user: process.env.GMAIL_SENDER,
    pass: process.env.GMAIL_PASS
  });

  const profiles = process.env.PROFILES.split(',') // TODO: get profile list from a DB

  const resolver = async fbId => {
    await sleep({sec: 2});
    return {
      fbId,
      inRelationship: await checkRelationship({
        fbId,
        page: await browser.newPage()
      })
    }
  } ;


  const processProfiles = async ({ haystack, doInParallel = false }) => {
    if(doInParallel){
      return await Promise.all(profiles.map(resolver));
    }
    let done = [];
    for (const item of haystack) {
      done = [...done, await resolver(item)];
    }
    return done;
    return haystack.reduce(async (acc, item) => {
      return [...acc, await resolver(item)]
    }, []);
  }

  const profilesDone = await processProfiles({
    haystack: profiles
  });

  await browser.close();

  const notifier = async ({ fbIds }) => {
    const html = fbIds
      .map(profile => `https://facebook.com/${profile} IS SINGLE`)
      .join('\r\n');

    await sendMail({
      to: process.env.EMAIL_NOTIFICATION,
      from: process.env.GMAIL_SENDER,
      subject: 'ZINC detected profiles getting single',
      html
    });
  }
  
  const singleProfiles = profilesDone.filter(profile => profile.inRelationship === false)

  const singleFbIds = singleProfiles.reduce((acc, curr) => [...acc, curr.fbId], []);

  console.log(singleFbIds);

  await notifier({
    fbIds: singleFbIds
  });

})();

