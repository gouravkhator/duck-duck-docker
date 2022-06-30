const express = require("express");
const {
  getRedisClient,
  insertValueInListRedis,
  existsInListRedis,
} = require("./redis.service");

const app = express();

app.use(async (req, res, next) => {
  try {
    await getRedisClient();
    return next();
  } catch (err) {
    return res.status(503).send(err.message);
  }
});

app.get("/", async (req, res) => {
  try {
    await insertValueInListRedis({ value: "gourav" });

    let doesGouravExists = await existsInListRedis({ value: "gourav" });
    let doesGoExists = await existsInListRedis({ value: "go" });

    await insertValueInListRedis({ value: "go" });
    let doesNewGoExists = await existsInListRedis({ value: "go" });

    return res.send(
      JSON.stringify({
        redisConn: "success",
        doesGouravExists,
        doesGoExists,
        doesNewGoExists,
      })
    );
  } catch (err) {
    return res.status(503).send(err.message);
  }
});

const PORT = process.env.SERVER_PORT ?? 8081;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
