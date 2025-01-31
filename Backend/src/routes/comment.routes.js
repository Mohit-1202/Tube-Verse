import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJwt);
router.route()
export default commentRouter = router;