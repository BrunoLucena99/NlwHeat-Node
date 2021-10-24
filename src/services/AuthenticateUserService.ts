import axios from "axios"
import prismaClient from "../prisma";
import { sign } from 'jsonwebtoken';

interface IAccessTokenResponse {
	access_token: string;
}

interface UserResponse {
	avatar_url: string;
	login: string;
	id: number;
	name: string;
}

class AuthenticateUserService {
	async execute(code: string, browser: boolean = false) {
		const url = 'https://github.com/login/oauth/access_token';

		const client_secret = browser ? process.env.GITHUB_CLIENT_SECRET_BROWSER : process.env.GITHUB_CLIENT_SECRET;
		const client_id = browser ? process.env.GITHUB_CLIENT_ID_BROWSER : process.env.GITHUB_CLIENT_ID;
	
		try {
			const { data: accessTokenResponse } = await axios.post<IAccessTokenResponse>(url, null, {
				params: {
					client_id,
					client_secret,
					code,
				},
				headers: {
					"Accept": "application/json",
				}
			});
	
			const response = await axios.get<UserResponse>('https://api.github.com/user', {
				headers: {
					authorization: `Bearer ${accessTokenResponse.access_token}`
				}
			});
	
			const { login, id, avatar_url, name } = response.data;
	
			let user = await prismaClient.user.findFirst({
				where: {
					github_id: id,
				}
			});
	
			if (!user) {
				user = await prismaClient.user.create({
					data: {
						github_id: id,
						login,
						avatar_url,
						name,
					}
				})
			}
	
			const tokenUser = {
				user: {
					name: user.name,
					avatar_url: user.avatar_url,
					id: user.id
				},
			}
	
			const token = sign(
				tokenUser, process.env.JWT_SECRET,
				{
					subject: user.id,
					expiresIn: '1d'
				}
			);
	
			return { token, user };
		} catch (err) {
			console.log(err)
			throw err;
		}
	}
}

export { AuthenticateUserService }