/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryTypes } from 'sequelize';

import { mysql } from '@/lib/mysql';

export default class StatisticsRepository {
    async excellentStudents(id: number, year: string): Promise<any> {
        return await mysql.query(
            `select
                s._id,
                s.society_name,
                SUM(case
                    when a.content = '◎'
                    then 2
                    when a.content = '○'
                    then 1
                    when a.content = '△'
                    then 1
                end) as \`count\`
            FROM student s
            JOIN attendance a
            ON s._id = a.student_id
            WHERE a.date like '${year}%'
            AND s.group_id in (
                SELECT _id
                FROM \`group\`
                WHERE account_id = ${id}
            )
            group by s._id
            order by \`count\` desc
            limit 10`,
            { type: QueryTypes.SELECT }
        );
    }
}
