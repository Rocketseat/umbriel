const sendEmail = jest.fn().mockReturnValue({
  promise: jest.fn(),
});

jest.mock('aws-sdk/clients/ses', () => {
  return jest.fn().mockImplementation(() => {
    return {
      sendEmail,
    };
  });
});

export default { sendEmail };
