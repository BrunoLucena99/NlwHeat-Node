import { Request, Response } from "express"
import { GetThreeLastMessagesService } from "../services/GetThreeLastMessagesService"

class GetThreeLastMessagesController {
	async handle(req: Request, res: Response) {
		const service = new GetThreeLastMessagesService();

		const result = await service.execute();

		return res.json(result);
	}
}

export { GetThreeLastMessagesController }

