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
    }

    setPage(page: number) {
        this.page = page;
    }

    setSize(size: number) {
        this.size = size;
    }

    async setTransaction() {
        this.transaction = await mysql.transaction();
    }

    abstract findAll(): Promise<T[]>;
    abstract findAll<U>(where: any): Promise<{rows: U[]; count: number}>; // pagenation

    abstract findOne(): Promise<T>;
    abstract findOne<U>(param: U): Promise<T>;

    abstract create<U>(param: U): Promise<T>;

    abstract update<U>(param: U): Promise<number>;

    abstract delete(): Promise<number>;
    abstract delete<U>(param: U): Promise<number>;
}
