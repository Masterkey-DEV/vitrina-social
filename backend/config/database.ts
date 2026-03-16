export default ({ env }) => {
  const connectionString = env("DATABASE_URL");

  return {
    connection: {
      client: "postgres",
      connection: {
        connectionString,
        // Configuración crítica para Railway/Heroku/Render
        ssl: env.bool("DATABASE_SSL", true) && {
          rejectUnauthorized: false, 
        },
      },
      pool: {
        min: env.int("DATABASE_POOL_MIN", 2),
        max: env.int("DATABASE_POOL_MAX", 10),
      },
      acquireConnectionTimeout: env.int("DATABASE_CONNECTION_TIMEOUT", 60000),
    },
  };
};