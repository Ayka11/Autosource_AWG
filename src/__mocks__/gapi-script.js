jest.mock("gapi-script", () => ({
  gapi: {
    load: jest.fn(),
    auth2: {
      getAuthInstance: jest.fn().mockReturnValue({
        signIn: jest.fn().mockResolvedValue({
          getBasicProfile: () => ({
            getName: () => "Test User",
            getEmail: () => "test@example.com",
            getImageUrl: () => "https://example.com/photo.jpg",
          }),
          getAuthResponse: () => ({ id_token: "mock-token" }),
        }),
      }),
    },
  },
}));
