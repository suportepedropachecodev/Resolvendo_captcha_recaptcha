const puppeteer = require('puppeteer-extra');
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
require('dotenv').config();

const IDUSERNAME = process.env.IDUSERNAME;
const TOKEN = process.env.TOKEN;

const sitealvo = 'https://servicos.receita.fazenda.gov.br/Servicos/CPF/ConsultaSituacao/ConsultaPublica.asp'
const cpf = '08027956412'
const dtnascimento = '24041989'

puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: IDUSERNAME,
      token: TOKEN 
    },
    visualFeedback: true 
  })
)

puppeteer.launch({
  headless: false,
  executablePath: '/opt/google/chrome/chrome',
  ignoreHTTPSErrors: true
}).then(async browser => {
  const page = await browser.newPage()
  await page.goto(sitealvo)

  await page.waitForSelector('input[name="txtCPF"]');
  await page.type('input[name="txtCPF"]', cpf, { delay: 185 });
  await page.type('input[name="txtDataNascimento"]', dtnascimento, { delay: 185 });

  await page.solveRecaptchas()

  await Promise.all([
    page.waitForNavigation(),
    page.click('#id_submit')
  ])
  await page.screenshot({ path: `ResultCpf-${cpf}.png`, fullPage: true })
  await browser.close()
})