import { Hoa } from "../../entities/hoa.entity";

export interface HoaPersistence {
    save: <E extends Error>(hoa: Hoa[]) => Promise<Hoa[] | E>;
}