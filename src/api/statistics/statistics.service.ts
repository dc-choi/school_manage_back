/* eslint-disable @typescript-eslint/no-explicit-any */
import StatisticsRepository from './statistics.repository';

export default class StatisticsService {
    async excellentStudents(accountId: number, year: string) {
        return await new StatisticsRepository().excellentStudents(accountId, year);
    }
}
