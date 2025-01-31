import { PageService } from "../../interfaces/services/i.page.service";
import { HoaData } from "../../types/hoa-data.type";
import { getAgentName } from "../../utils/extraction/agent.name";

export class BizFileOnlinePageService {

    private search_input_class = "search-input";
    private search_button_class = 'search-button '
    private table_class = 'div-table-body'
    private table_more_info_class = 'details-list'
    private hoa_name_class = 'title-box';
    private agent_name_col = 5;
    private name_col = 0;
    private status_col = 2;
    private formed_in_col = 4;
    private mailing_address_col = 0;
    constructor(private url: string, private pageService: PageService) {}

    fillSearch(text: string) {
        this.pageService.enterTextByClassName(this.search_input_class, text)
        return this;
    }

    enterSearchButton() {
        this.pageService.clickByClass(this.search_button_class)
        return this;
    }

    clickDetailsButtonInTable(row: number) {
        this.pageService.waitForElement("." + this.table_class)
        this.pageService.clickTableCell(this.table_class, row, 0)
        return this;
    }

    readTableDetails(row: number, cd?: (data: HoaData) => void) {
        (async () => {
            this.pageService.waitForElement("." + this.table_class)
            this.pageService.clickByClass(this.table_class)
            const status = await this.pageService.readTableData(this.table_class, row, this.status_col)
            const formed_in = await this.pageService.readTableData(this.table_class, row, this.formed_in_col)
            const mailing_address = await this.pageService.readTableData(this.table_class, row, this.mailing_address_col)
            const agent_name = await this.pageService.readTableData(this.table_class, row, this.agent_name_col)
            const name = await this.pageService.readTableData(this.table_class, row, this.name_col)
            const hoaData : HoaData = {
                status,
                formed_in,
                mailing_address,
                name,
                agent_name
            }
            if(cd) cd(hoaData);
        })()
        return this;
    }

    async getAmountOfRowsOnPage(): Promise<number> {
        await this.pageService.waitForElement("." + this.table_class)
        return await this.pageService.countTableRows(this.table_class)
    }

}