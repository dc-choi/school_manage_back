/* eslint-disable @typescript-eslint/no-explicit-any */
import ApiCode from "./api.codes";
import ApiMessages from "./api.messages";

// staic을 이용해서 외부에서 new를 사용하지않아도 새 객체를 만들어내도록 함.
export class Result<T> {
    public isSuccess: boolean;
    public error: any;
    private readonly _value: T;

    private constructor(isSuccess: boolean, error?: string, value?: T) {
        if (isSuccess && error) {
            throw new Error(`InvalidOperation: A result cannot be successful and contain an error`);
        }
        if (!isSuccess && !error) {
            throw new Error(`InvalidOperation: A failing result needs to contain an error message`);
        }

        this.isSuccess = isSuccess;
        this.error = error;
        this._value = value;

        Object.freeze(this);
    }

    private get json(): any {
        return this.isSuccess ? {
            code: ApiCode.OK,
            message: ApiMessages.OK,
            result: this._value
        } : {
            code: this.error?.code || ApiCode.INTERNAL_SERVER_ERROR,
            message: this.error?.message || ApiMessages.INTERNAL_SERVER_ERROR,
        };
    }

    public toJson(): any {
        return this.json;
    }

    public getValue() : T {
        return this._value;
    }

    public static ok<U>(value?: U) : Result<U> {
        return new Result<U>(true, null, value);
    }

    public static fail<U>(error: string): Result<U> {
        return new Result<U>(false, error);
    }
}
