import ApiError from './api.error';
import ApiCodes from './api.codes';
import ApiMessages from './api.messages';

const validator = async(params = []) => {
    params.forEach((item) => {
        if (!item || item.length <= 0)
            throw new ApiError(ApiCodes.BAD_REQUEST, `${ApiMessages.BAD_REQUEST}: param is wrong`);
    });
};

export default validator;
