import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
	sub: string;
}

export function ensureAuthententicated(req: Request, res: Response, next: NextFunction) {
	const authToken = req.headers.authorization;

	if (!authToken) {
		return res.status(401).json({
			error: 'token.invalid'
		});
	}

	try {
		const [, token] = authToken.split(' ');
		const { sub } = verify(token, process.env.JWT_SECRET) as IPayload;
		req.user_id = sub;

		return next();
	} catch (err) {
		return res.status(401).json({error: 'token.expired'});
	}
}