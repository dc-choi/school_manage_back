/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryTypes } from 'sequelize';

import { mysql } from '@/lib/mysql';

export default class StatisticsRepository {
    async excellentStudents(accountId: number, year: string): Promise<any> {
        return await mysql.query(
            `select
                s._id,
                s.student_society_name,
                SUM(case
                    when a.attendance_content = '◎'
                    then 2
                    when a.attendance_content = '○'
                    then 1
                end) as \`count\`
            FROM student s
            JOIN attendance a
            ON s._id = a.student__id
            WHERE a.attendance_date like '${year}%'
            AND s.group__id in (
                SELECT _id
                FROM \`group\`
                WHERE account__id = ${accountId}
            )
            group by s._id
            order by \`count\` desc
            limit 10`,
            { type: QueryTypes.SELECT }
        );
    }
}
