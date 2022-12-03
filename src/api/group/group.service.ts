// import { env } from '../../env';

// import logger from '../../lib/logger';
// import ApiCodes from '../../lib/api.codes';
import ApiMessages from '../../lib/api.messages';
// import ApiError from '../../lib/errors';

import GroupRepository from './group.repository';

export default class GroupService {
    async getGroups(_id: number) {
        const groups = await new GroupRepository().getGroups(_id);

        return {
            message: ApiMessages.OK,
            groups
        };
    }

    async getGroup(groupId: number) {
        const group = await new GroupRepository().getGroup(groupId);

        return {
            message: ApiMessages.OK,
            group
        };
    }

    async createGroup(name: string, accountId: number) {
        await new GroupRepository().createGroup(name, accountId);

        return {
            message: ApiMessages.OK
        };
    }

    async updateGroup(groupId: number, name: string, accountId: number) {
        await new GroupRepository().updateGroup(groupId, name, accountId);

        return {
            message: ApiMessages.OK
        };
    }

    async deleteGroup(groupId: number) {
        await new GroupRepository().deleteGroup(groupId);

        return {
            message: ApiMessages.OK
        };
    }
}
