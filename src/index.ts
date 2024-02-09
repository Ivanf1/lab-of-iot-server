import express, { Request, Response } from "express";
import db from "./db/db";
import "./mqtt/mqtt";

const app = express();
const port = process.env.PORT || 3000;

app.get("/api/cube-scanner", async (_: Request, res: Response) => {
  console.log("request for cube scanners");

  try {
    const result = await db.cube_scanner.findMany({
      include: {
        pickup_point: {
          select: {
            position: true,
          },
        },
      },
    });
    const response = {
      message: "ok",
      data: result,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      message: "error",
    });
  }
});

app.listen(port, () => {
  console.log(`HTTP Server listening on port ${port}`);
});
