// import { env } from '../../env';

// import logger from '../../lib/logger';
// import ApiCodes from '../../lib/api.codes';
import ApiMessages from '../../lib/api.messages';
// import ApiError from '../../lib/errors';

import GroupRepository from './group.repository';

export default class GroupService {
    public getGroups = async(_id) => {
        const groups = await new GroupRepository().getGroups(_id);

        return {
            message: ApiMessages.OK,
            groups
        };
    };

    public getGroup = async(groupId) => {
        const group = await new GroupRepository().getGroup(groupId);

        return {
            message: ApiMessages.OK,
            group
        };
    };

    public createGroup = async({ name, accountId }) => {
        await new GroupRepository().createGroup({ name, accountId });

        return {
            message: ApiMessages.OK
        };
    };

    public updateGroup = async({ groupId, name, accountId }) => {
        await new GroupRepository().updateGroup({ groupId, name, accountId });

        return {
            message: ApiMessages.OK
        };
    };

    public deleteGroup = async(groupId) => {
        await new GroupRepository().deleteGroup(groupId);

        return {
            message: ApiMessages.OK
        };
    };
}
