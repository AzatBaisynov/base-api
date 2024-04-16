import { Module } from "@nestjs/common";
import { ModulesConfig } from "src/config/module.config";
import { FileService } from "./file.service";
import { FileController } from "./file.controller";

@Module({
	imports: ModulesConfig.imports,
	controllers: [FileController],
	providers: ModulesConfig.providers,
	exports: [FileService]
})
export class FileModule {}