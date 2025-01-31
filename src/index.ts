import { Configuration } from "./config";
import path from "path";
import dotenv from 'dotenv';
import { HoaPersistenceCsv } from "./persistences/hoa.persistence.csv";
import { CsvReadableService } from "./services/csv.readable.service";
import { CsvWritableService } from "./services/csv.writable.service";
import { HoaRepository } from "./repositories/hoa.repository";
import { HoaData } from "./types/hoa-data.type";
import { BizFileOnlinePageService } from "./services/pages/biz.file.online.page.service";
import { PlayWrightPageService } from "./services/playwright.page.service";
import { chromium } from 'playwright';

dotenv.config();

const configuration = new Configuration(process.env)
const csvReadService = new CsvReadableService()
const csvWriteService = new CsvWritableService()

configuration.load([
    { name: 'HOA_WEBSITE_URL', required: true, description: 'Website url to gather information from' },
    { name: 'DATA_STORE_PATH', required: false, description: 'Path from root for the csv files', default: path.resolve(__dirname, '../data') }
])

const HOA_WEBSITE_URL = configuration.data.HOA_WEBSITE_URL
const DATA_STORE_PATH = configuration.data.DATA_STORE_PATH

const hoaPersistence = new HoaPersistenceCsv(DATA_STORE_PATH + '/hoa.csv', csvWriteService, csvReadService)
const hoaRepository = new HoaRepository(hoaPersistence)
const item : HoaData[] = [
    {
        status: 'active',
        formed_in: '12-3-2333',
        agent_name: 'Kal Dmitri',
        mailing_address: '56 Schooner',
        name: 'Hoa Company 123'
    },
    {
        status: 'active',
        formed_in: '12-3-23e33',
        agent_name: 'Belle Bailey',
        mailing_address: '56 Schooner',
        name: 'Hoa Division 123'
    }
];


(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    const pageService = new PlayWrightPageService(page);
  
    // Navigate to the HOA website
    await page.goto(HOA_WEBSITE_URL);
  
    const bizFileOnlinePageService = new BizFileOnlinePageService(HOA_WEBSITE_URL, pageService);
  
    // Perform search
    bizFileOnlinePageService.fillSearch('Hoa');
    bizFileOnlinePageService.enterSearchButton();
  
    const rowCount = await bizFileOnlinePageService.getAmountOfRowsOnPage();
  
    // Read and process each row one by one
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
  
      // Read the details of the current row
      bizFileOnlinePageService.readTableDetails(rowIndex, async (data) => {
        await hoaRepository.save([hoaRepository.create(data)])
      });
  
      // Optional: Add a small delay between rows to avoid overwhelming the page
      await page.waitForTimeout(500); // Adjust the delay as needed
    }
  
    // Close the browser
    await browser.close();

    // const hoas = item.map((h) => {
    //     return hoaRepository.create(h)
    // })
    // const result = await hoaRepository.save(hoas)
})();