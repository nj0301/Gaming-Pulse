export default {
  routes: [
    {
      method: "GET",
      path: "/search",
      handler: "search.query",
      config: {
        auth: false,
        // Public read-only endpoint; rate limiting applied via global middleware.
      },
    },
  ],
};
