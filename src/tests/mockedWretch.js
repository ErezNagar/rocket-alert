const mockedWretch = {
  url: jest.fn().mockReturnThis(),
  query: jest.fn().mockReturnThis(),
  get: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  // json: (res) => {
  //   return Promise.resolve({
  //     success: true,
  //     error: null,
  //     payload: 7208,
  //   });
  // },
  //catch
};
export { mockedWretch };
