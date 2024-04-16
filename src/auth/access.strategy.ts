import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		configService: ConfigService,
		private readonly userService: UserService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('JWT_SECRET')
		})
	}

	async validate(payload: any) {
		const user = await this.userService.findById(payload.id)
		if (!(user && user.refreshToken)) {
			throw new HttpException("You have been log outed", HttpStatus.UNAUTHORIZED)
		}
		return { id: payload.id, username: payload.username, email: payload.email, roles: payload.roles };
	}
}