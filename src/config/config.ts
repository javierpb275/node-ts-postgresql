export default {
  DB: {
    URI: "somedburl",
    USER:  process.env.DB_USER || "somedbuser",
    PASSWORD: process.env.DB_PASSWORD || "somedbpassword",
    HOST: process.env.DB_HOST || "somedbhost",
    NAME: process.env.DB_NAME || "somedbname",
    PORT: Number(process.env.DB_PORT) || 5432
  },
  AUTH: {
    ACCESS_TOKEN_SECRET:
      process.env.ACCESS_TOKEN_SECRET || "someaccesstokensecret",
    REFRESH_TOKEN_SECRET:
      process.env.REFRESH_TOKEN_SECRET || "somerefreshtokensecret",
    ACCESS_TOKEN_EXPIRATION: "1h",
    REFRESH_TOKEN_EXPIRATION: "30d",
  },
};
