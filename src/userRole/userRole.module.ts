import { Module } from "@nestjs/common";
import { ModulesConfig } from "src/config/module.config";

@Module({
	imports: ModulesConfig?.imports,
	controllers: [],
	providers: ModulesConfig?.providers,
})
export class UserRoleModule { }