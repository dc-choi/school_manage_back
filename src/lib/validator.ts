import ApiError from './api.error';
import ApiCodes from '../lib/api.codes';
import ApiMessages from '../lib/api.messages';

const validator = async(params = []) => {
    params.forEach((item) => {
        if (!item || item.length <= 0)
            throw new ApiError(ApiCodes.BAD_REQUEST, `${ApiMessages.BAD_REQUEST}: param is wrong`);
    });
};

export default validator;
