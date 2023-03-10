/* eslint-disable @typescript-eslint/no-explicit-any */
import { Transaction } from "sequelize";

import { mysql } from "@/lib/mysql";

export default abstract class BaseRepository<T> {
    protected _id: number;
    protected page: number; // pagenation page
    protected size: number; // pagenation size
    protected transaction: Transaction;

    setId(id: number) {
        this._id = id;
        return this;
    }

    setPage(page: number) {
        this.page = page;
        return this;
    }

    setSize(size: number) {
        this.size = size;
        return this;
    }

    async setTransaction() {
        this.transaction = await mysql.transaction();
        return this;
    }

    abstract findAll(): Promise<T[]>;
    abstract findAndCountAll(where: any): Promise<{rows: any; count: number}>; // pagenation
    abstract findOne(): Promise<T>;
    abstract create(param): Promise<T>;
    abstract update(param): Promise<T>;
    abstract delete(): Promise<T>;
}
