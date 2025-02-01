import { ClickablePage } from "../../interfaces/services/i.clickable.page.service";
import { NavigatablePage } from "../../interfaces/services/i.navigatable.page.service";
import { ReadablePage } from "../../interfaces/services/i.readabe.page.service";
import { TableReadablePage } from "../../interfaces/services/i.table.readable.page.service";
import { TrackablePage } from "../../interfaces/services/i.trackable.page.service";
import { WaitablePage } from "../../interfaces/services/i.waitable.page.service";
import { WritablePage } from "../../interfaces/services/i.writable.page.service";

export class NeighborhoodEmpowermentService {
    constructor(private url: string, private pageService: (
        NavigatablePage &
        ClickablePage &
        ReadablePage &
        WritablePage &
        TableReadablePage &
        WaitablePage &
        TrackablePage
    )) {}

    private table_class = 'verdana';

    async navigate() {
        await this.pageService.navigate(this.url);
    }

    async load() {
        await this.pageService.scrollIntoViewIfNeeded("#" + this.table_class);
        console.log(await this.pageService.getTableDataBySelector(this.table_class, 1));
    }


}