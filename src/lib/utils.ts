// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const prune = (obj: any) => {
    Object.keys(obj).forEach((key) => (obj[key] === undefined || obj[key] === null) && delete obj[key]);
    return obj;
};
