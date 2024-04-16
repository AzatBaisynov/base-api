import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch, UseInterceptors, UploadedFile, ParseFilePipeBuilder } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserInterface, UserBody, TokenResponse, IUserLogin } from "./user.types";
import { AccessTokenGuard } from "src/auth/access.guard";
import { UserRoleName } from "src/userRole/userRole.types";
import { RolesGuard } from "src/auth/roles.guard";
import { HasRoles } from "src/auth/roles.decorator";
import { RefreshTokenGuard } from "src/auth/refresh.guard";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('users')
export class UserController {
	constructor(
		private readonly userService: UserService
	) { }

	@Get()
	findAll() {
		return this.userService.findAll()
	}

	@Post()
	async createUser(@Body() body: CreateUserInterface): Promise<TokenResponse> {
		return await this.userService.createUser(body)
	}

	@Post('signin')
	signin(@Body() data: IUserLogin): Promise<TokenResponse> {
		return this.userService.signIn(data);
	}

	@Get('logout')
	@UseGuards(AccessTokenGuard)
	logout(
		@Request()
		{ user }
	) {
		return this.userService.logout(user.id);
	}

	@Get('refresh')
	@UseGuards(RefreshTokenGuard)
	refreshTokens(
		@Request()
		{ user }
	) {
		return this.userService.refreshTokens(user.id, user.refreshToken)
	}

	@UseGuards(AccessTokenGuard)
	@Post('confirm/:code')
	async confirmUserEmail(
		@Param('code')
		code: string,
		@Request()
		{ user }
	) {
		console.log("TEST")
		return await this.userService.confirmUserEmail(user.id, code)
	}

	@UseGuards(AccessTokenGuard)
	@Post("update/email/:email")
	async registerNewEmail(
		@Param('email')
		email: string,
		@Request()
		{ user }
	) {
		return await this.userService.registerNewUserEmail(user.id, email)
	}

	/* TODO: Delete this method after development finished */
	@Get('/test')
	async test(
		@Request()
		req
	) {
		console.dir(req)
		return "OK"
	}

	@Post("super-admin")
	async createNewSuperAdmin(
		@Body() user: UserBody
	) {
		return await this.userService.createSuperAdmin(user)
	}

	@Patch('super-admin/email/:email')
	async updateSuperAdminEmail(
		@Param('email')
		email: string
	) {
		return this.userService.changeSuperAdminEmail(email)
	}

	@Patch('super-admin/password')
	async resendSuperAdminPassword() {
		return this.userService.resendSuperAdminPassword()
	}

	@HasRoles(UserRoleName.SUPER_ADMIN, UserRoleName.USER)
	@UseGuards(AccessTokenGuard, RolesGuard)
	@Patch("super-admin/confirm")
	async confirmSuperAdmin(
		@Request()
		{ user }
	) {
		return this.userService.confirmSuperAdmin(user.id)
	}

	@Post('profile-photo')
	@UseGuards(AccessTokenGuard)
	@UseInterceptors(FileInterceptor('profile-photo'))
	async addProfilePhoto(
		@UploadedFile(
			new ParseFilePipeBuilder()
				.addMaxSizeValidator({
					maxSize: 5242880
				})
				.addFileTypeValidator({
					fileType: /[^\s]+(.*?).(jpg|jpeg|png|JPG|JPEG|PNG)$/
				})
				.build()
		) file: Express.Multer.File,
		@Request()
		{ user }
	) {
		return this.userService.addUserProfilePhoto(user.id, file)
	}

}

