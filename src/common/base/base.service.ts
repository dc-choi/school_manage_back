/* eslint-disable @typescript-eslint/no-explicit-any */
export default abstract class BaseService<T> {
    protected _id: number;
    protected page: number; // pagenation page
    protected size = 10; // pagenation size
    protected year: number;

    setId(id: number) {
        this._id = id;
    }

    setPage(page: number) {
        this.page = page;
    }

    setYear(year = new Date().getFullYear()) {
        this.year = year;
    }

    abstract list(): Promise<T[]>;
    abstract list<U>(where: any): Promise<U>; // pagenation

    abstract get(): Promise<T>;
    abstract get<U>(param: U): Promise<T>;

    abstract add<U>(param: U): Promise<T>;

    abstract modify<U>(param: U): Promise<number>;

    abstract remove(): Promise<number>;
    abstract remove<U>(param: U): Promise<number>;
}
