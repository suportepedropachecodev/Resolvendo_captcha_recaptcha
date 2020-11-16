const puppeteer = require('puppeteer-extra');
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
require('dotenv').config();

const IDUSERNAME = process.env.IDUSERNAME;
const TOKEN = process.env.TOKEN;

const sitealvo = 'https://servicos.receita.fazenda.gov.br/Servicos/cnpjreva/Cnpjreva_Solicitacao.asp';
const cnpj = '11145209000160';

puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: IDUSERNAME,
      token: TOKEN ,
    },
    visualFeedback: true 
  })
)
 
puppeteer.launch({ 
  headless: false,
  executablePath: '/opt/google/chrome/chrome',
  ignoreHTTPSErrors:true
 }).then(async browser => {
  const page = await browser.newPage()
  await page.goto(sitealvo)

  await page.waitForSelector('input[name="cnpj"]');
  await page.type('input[name="cnpj"]',cnpj, {delay: 185});
 
  await page.solveRecaptchas()
 
  await Promise.all([
    page.waitForNavigation(),
    page.click('.btn-primary')
  ])
  await page.screenshot({ path: `ResultCnpj-${cnpj}.png`, fullPage: true })
  await browser.close()
})