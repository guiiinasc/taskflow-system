import { Router } from "express";
import { listByYear } from "./holidays.controller";

const router = Router();

router.get("/:year", listByYear);

export default router;
