import schedule from 'node-schedule';

import logger from '@/lib/logger';
import { mysql } from '@/lib/mysql';

class Scheduler {
    static async studentAge() {
        // 초(옵션), 분, 시, 일, 월, 요일
        const time = '0 0 1 1 *';
        schedule.scheduleJob(time, async() => {
            mysql.query('UPDATE student SET student_age = student_age + 1');
            logger.log("Scheduler is working!!");
        });
    }
}

export default Scheduler;
