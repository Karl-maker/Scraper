import { Configuration } from "./config";
import path from "path";
import dotenv from 'dotenv';
import { HoaPersistenceCsv } from "./persistences/hoa.persistence.csv";
import { CsvReadableService } from "./services/csv.readable.service";
import { CsvWritableService } from "./services/csv.writable.service";
import { HoaRepository } from "./repositories/hoa.repository";
import { HoaData } from "./types/hoa-data.type";
import { PlayWrightPageService } from "./services/playwright.page.service";
import { chromium } from 'playwright';
import { NeighborhoodEmpowermentService } from "./services/pages/neighborhood.empowerment.service";

dotenv.config();

const configuration = new Configuration(process.env)
const csvReadService = new CsvReadableService()
const csvWriteService = new CsvWritableService()

configuration.load([
    { name: 'NEIGHBORHOOD_EMPOWERMENT_URL', required: true, description: 'Website url to gather information from neighborhood empowerment' },
    { name: 'DATA_STORE_PATH', required: false, description: 'Path from root for the csv files', default: path.resolve(__dirname, '../data') }
])

const NEIGHBORHOOD_EMPOWERMENT_URL = configuration.data.NEIGHBORHOOD_EMPOWERMENT_URL
const DATA_STORE_PATH = configuration.data.DATA_STORE_PATH

const hoaPersistence = new HoaPersistenceCsv(DATA_STORE_PATH + '/hoa.csv', csvWriteService, csvReadService)
const hoaRepository = new HoaRepository(hoaPersistence);


(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    const pageService = new PlayWrightPageService(page);
    const neigborhoodEmpowermentService = new NeighborhoodEmpowermentService(NEIGHBORHOOD_EMPOWERMENT_URL, pageService)
    
    await neigborhoodEmpowermentService.navigate()
    await neigborhoodEmpowermentService.load();
  
    await browser.close();
})();