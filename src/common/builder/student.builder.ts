import { IStudent } from '@/@types/student';

// 생성자에 너무 많은 매개변수를 넣을 경우 Builder Patten으로 생성하도록 함.
export default class StudentBuilder {
    constructor(
        public page?: number,
        public size?: number,
        public totalPage?: number,
        public students?: IStudent[],
    ) {}

    setPage(page: number, size: number) {
        this.page = page;
        this.size = size;
        return this;
    }

    setTotalPage(totalPage: number) {
        this.totalPage = totalPage;
        return this;
    }

    setStudents(students: IStudent[]) {
        this.students = students;
        return this;
    }
}
