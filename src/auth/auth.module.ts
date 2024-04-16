import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "src/user/user.service";
import { User } from "src/user/user.entity";
import { AuthService } from "./auth.service";
import { UserModule } from "src/user/user.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AccessTokenStrategy } from "./access.strategy";
import { Confirmation } from "src/confirmation/confirmation.entity";
import { ConfirmationService } from "src/confirmation/confirmation.service";
import { UserRole } from "src/userRole/userRole.entity";
import { UserRoleService } from "src/userRole/userRole.service";
import { RefreshTokenStrategy } from "./refresh.stategy";
import { ConfirmationModule } from "src/confirmation/confirmation.module";
import { UserRoleModule } from "src/userRole/userRole.module";
import { FileModule } from "src/file/file.module";
import { FileService } from "src/file/file.service";
import { File } from "src/file/file.entity";

/* TODO: remove twoway relations between auth.module and user.module */
@Module({
	imports: [
		TypeOrmModule.forFeature([User, Confirmation, UserRole, File]),
		forwardRef(() => UserModule),
		forwardRef(() => ConfirmationModule),
		forwardRef(() => UserRoleModule),
		PassportModule,
		// JwtModule.register({
		// })
	],
	controllers: [],
	providers: [AuthService, JwtService, UserService, AccessTokenStrategy, RefreshTokenStrategy, ConfirmationService, UserRoleService, FileService],
})
export class AuthModule { }