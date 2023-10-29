const asyncHandler = (API) => {
  return (req, res, next) => {
    API(req, res, next).catch((err) => {
      res.status(500).json({ message: "Fail", err });
    });
  };
};

export default asyncHandler;