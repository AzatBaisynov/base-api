import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserInterface } from "src/user/user.types";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private configService: ConfigService
	) { }

	async getTokens(user: UserInterface) {
		console.log("CHECK", user)
		const [access_token, refresh_token] = await Promise.all([
			this.jwtService.signAsync(
				{
					username: user.username, email: user.email, id: user.id, roles: user.roles
				},
				{
					secret: this.configService.get<string>('JWT_SECRET'),
					expiresIn: '15m'
				}
			),
			this.jwtService.signAsync(
				{
					username: user.username, id: user.id
				},
				{
					secret: this.configService.get<string>('REFRESH_SECRET'),
					expiresIn: '7d'
				}
			)
		])
		
		return {
			access_token,
			refresh_token
		}
	}
}