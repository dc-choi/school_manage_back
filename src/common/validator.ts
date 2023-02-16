import ApiError from './api.error';
import ApiCodes from './api.codes';
import ApiMessages from './api.messages';

/**
 * 추후에 변경이 필요함.
 *
 * @param params
 */
export const validator = async(params = []) => {
    params.forEach((item) => {
        if (!item || item.length <= 0)
            throw new ApiError(ApiCodes.BAD_REQUEST, `${ApiMessages.BAD_REQUEST}: param is wrong`);
    });
};
