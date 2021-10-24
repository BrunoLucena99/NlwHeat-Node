import { Router } from "express";
import { AuthenticateUserController } from "./controllers/AuthenticatedUserController";
import { CreateMessageController } from "./controllers/CreateMessageController";
import { GetThreeLastMessagesController } from "./controllers/getThreeLastMessagesController";
import { ProfileUserController } from "./controllers/ProfileUserController";
import { ensureAuthententicated } from "./middlewares/ensureAuthenticated";

const router = Router();

router.post('/authenticate', new AuthenticateUserController().handle);

router.post('/messages', ensureAuthententicated, new CreateMessageController().handle);

router.get('/messages/last3', new GetThreeLastMessagesController().handle);

router.get('/profile', ensureAuthententicated, new ProfileUserController().handle);

export { router }