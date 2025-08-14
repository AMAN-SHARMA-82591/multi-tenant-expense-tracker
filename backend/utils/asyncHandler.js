const asyncHandler = (callbackfn) => (req, res, next) => {
  Promise.resolve(callbackfn(req, res, next)).catch(next);
};
export default asyncHandler;
