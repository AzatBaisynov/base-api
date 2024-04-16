import { Provider, DynamicModule, ForwardReference, Type, forwardRef } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"
import { MulterModule } from "@nestjs/platform-express"
import { TypeOrmModule } from "@nestjs/typeorm"
import { diskStorage } from "multer"
import { extname, resolve } from "path"
import { AuthModule } from "src/auth/auth.module"
import { AuthService } from "src/auth/auth.service"
import { Confirmation } from "src/confirmation/confirmation.entity"
import { ConfirmationService } from "src/confirmation/confirmation.service"
import { User } from "src/user/user.entity"
import { UserService } from "src/user/user.service"
import { UserRole } from "src/userRole/userRole.entity"
import { UserRoleService } from "src/userRole/userRole.service"
import { multerConfig } from "./multer.config"
import { File } from "src/file/file.entity"
import { FileService } from "src/file/file.service"

type ModuleConfigType = {
	imports: (ForwardReference<any> | Type<any> | DynamicModule | Promise<DynamicModule>)[]
	providers: Provider[],
	exports: Provider[]
}

/* TODO: remove twoway relations between auth.module and user.module */
export const ModulesConfig: ModuleConfigType = {
	imports: [
		TypeOrmModule.forFeature([User, Confirmation, UserRole, File]), 
		forwardRef(() => AuthModule),
		MulterModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => (multerConfig(
				configService.get<string>('MULTER_DEST')
			)),
			inject: [ConfigService]
		})
],
	providers: [UserService, ConfirmationService, UserRoleService, AuthService, JwtService, FileService],
	exports: [UserService, ConfirmationService, UserRoleService, AuthService, FileService]
}