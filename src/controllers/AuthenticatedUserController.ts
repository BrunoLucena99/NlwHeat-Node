import { Request, Response } from "express"
import { AuthenticateUserService } from "../services/AuthenticateUserService"

class AuthenticateUserController {
	async handle(req: Request, res: Response) {
		const { code, browser } = req.body;
		const service = new AuthenticateUserService();
		try {
			const result = await service.execute(code, browser); 
			return res.json(result);
		} catch (err) {
			return res.status(500).json({error: err.message});
		}
	}
}

export { AuthenticateUserController }

