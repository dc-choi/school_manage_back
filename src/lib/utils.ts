import ApiCodes from './api.codes';
import ApiMessages from './api.messages';

export const getSuccessResponse = (result) => {
    const payload = {
        code: ApiCodes.OK,
        message: ApiMessages.OK,
        ...result,
    };

    return payload;
};

export const getErrorResponse = (response) => {
    const payload = {
        code: response.code || ApiCodes.INTERNAL_SERVER_ERROR,
        message: response.message || ApiMessages.INTERNAL_SERVER_ERROR,
    };

    return payload;
};
