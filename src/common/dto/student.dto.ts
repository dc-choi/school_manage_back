import { IStudent } from '../../types/student';

export class StudentsDTO {
    constructor(
        public nowPage?: number,
        public rowPerPage?: number,
        public totalRow?: number,
        public totalPage?: number,
        public students?: IStudent[],
    ) {}
}

// 생성자에 너무 많은 매개변수를 넣을 경우 Builder Patten으로 생성하도록 함.
export class StudentsDTOBuilder {
    private nowPage?: number;
    private rowPerPage?: number;
    private totalRow?: number;
    private totalPage?: number;
    private students?: IStudent[];

    setNowPage(nowPage: number) {
        this.nowPage = nowPage;
        return this;
    }

    setRowPerPage(rowPerPage: number) {
        this.rowPerPage = rowPerPage;
        return this;
    }

    setTotalRow(totalRow: number) {
        this.totalRow = totalRow;
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

    build() {
        return new StudentsDTO(
            this.nowPage,
            this.rowPerPage,
            this.totalRow,
            this.totalPage,
            this.students,
        )
    }
}
