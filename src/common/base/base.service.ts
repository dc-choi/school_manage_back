/* eslint-disable @typescript-eslint/no-explicit-any */
export default abstract class BaseService<T> {
    protected _id: number;
    protected page: number; // pagenation page
    protected size = 10; // pagenation size
    protected year: number;

    setId(id: number) {
        this._id = id;
        return this;
    }

    setPage(page: number) {
        this.page = page;
        return this;
    }

    setYear(year = new Date().getFullYear()) {
        this.year = year;
        return this;
    }

    abstract list(): Promise<T[]>;
    abstract get(): Promise<T>;
    abstract add(param): Promise<T>;
    abstract modify(param): Promise<T>;
    abstract remove(): Promise<T>;
}
