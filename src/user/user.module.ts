import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { ModulesConfig } from "src/config/module.config";
import { UserService } from "./user.service";

@Module({
	imports: ModulesConfig?.imports,
	controllers: [ UserController ],
	providers: ModulesConfig?.providers,
	exports: [ UserService ]
})
export class UserModule {}
