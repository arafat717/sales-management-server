import { NextFunction, Request, Response, Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../utils/jwt";
import { Role } from "../user/user.interface";
import passport from "passport";

const router = Router()

router.post("/login", AuthController.loginUser);
router.post("/refresh-token", AuthController.createNewAccessToken);
router.post("/logout", AuthController.logout);
router.post("/change-password", checkAuth(...Object.values(Role)), AuthController.changePassword);
router.get('/google', async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/";
    passport.authenticate('google', { scope: ["profile", "email"], state: redirect as string })(req, res, next)
})
router.get("/google/callback", passport.authenticate('google', { failureRedirect: "/login" }), AuthController.googleCallbackController)

export const authRoutes = router;  