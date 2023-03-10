// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const prune = (obj: any) => {
    Object.keys(obj).forEach(key => (obj[key] === undefined || obj[key] === null) && delete obj[key]);
    return obj;
};

/**
 * 해당 연도의 토요일, 일요일을 반환한다.
 *
 * @param year
 * @returns
 */
export const getYearDate = async(year: number) => {
    const month = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ,11, 12 ];
    const sunday: Array<number[]> = []; // 1년중 일요일에 해당하는 날
    const saturday: Array<number[]> = []; // 1년중 토요일에 해당하는 날

    month.forEach(e => {
        const tempSunday: number[] = [];
        const tempSaturday: number[] = [];
        const lastDay = new Date(year, e, 0).getDate();

        for (let i = 1; i <= lastDay; i++) {
            const date = new Date(year, e - 1, i);
            if (date.getDay() === 0) {
                tempSunday.push(i);
            }
            if (date.getDay() === 6) {
                tempSaturday.push(i);
            }
        }
        sunday.push(tempSunday);
        saturday.push(tempSaturday);
    });

    return {
        sunday,
        saturday
    }
};

/**
 * 해당 연도, 월에 대한 토요일, 일요일을 반환한다.
 *
 * @param year
 * @param month
 * @returns
 */
export const getYearMonthDate = async(year: number, month: number) => {
    const sunday: string[] = [];
    const saturday: string[] = [];
    const lastDay = new Date(year, month, 0).getDate();

    for (let i = 1; i <= lastDay; i++) {
        const date = new Date(year, month, i);
        if (date.getDay() === 0) {
            let str = `${year}`;
            month < 10 ? str += `0${month}` : str += `${month}`;
            i < 10 ? str += `0${i}` : str += `${i}`;
            sunday.push(`${str}`);
        }
        if (date.getDay() === 6) {
            let str = `${year}`;
            month < 10 ? str += `0${month}` : str += `${month}`;
            i < 10 ? str += `0${i}` : str += `${i}`;
            saturday.push(`${str}`);
        }
    }

    return {
        sunday,
        saturday
    }
};

/**
 * year, month, day의 값으로 YYYYMMDD형식의 문자열을 반환한다.
 *
 * @param year
 * @param month
 * @param day
 * @returns
 */
export const getFullTime = async(year: number, month: number, day: number) => {
    let fullTime: string;

    if (month < 10 && day < 10)
        fullTime = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
    else if (month < 10)
        fullTime = `${year}${month.toString().padStart(2, '0')}${day}`;
    else if (day < 10)
        fullTime = `${year}${month}${day.toString().padStart(2, '0')}`;
    else
        fullTime = `${year}${month}${day}`;

    return fullTime;
};
