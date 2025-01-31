import { Hoa } from "../entities/hoa.entity";
import { HoaPersistence } from "../interfaces/persistence/i.hoa.persistence";
import { HoaData } from "../types/hoa-data.type";
import { v4 as uuidv4 } from 'uuid';

export class HoaRepository {
    constructor(private persistence: HoaPersistence) {}

    async save<E extends Error>(hoas: Hoa[]) : Promise<Hoa[] | E> {
        return await this.persistence.save(hoas);
    }

    /**
     * 
     * @param hoaData Data to represent hoa
     * @returns entity with any processing or sanitization needed to create it properly
     */

    create(hoaData: HoaData) : Hoa {
        return { ...hoaData, id: uuidv4() } as Hoa;
    }
}