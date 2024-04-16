import { Module } from "@nestjs/common";
import { Confirmation } from "./confirmation.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
	imports: [TypeOrmModule.forFeature([Confirmation])],
	controllers: [],
	providers: [ Confirmation ],
	exports: [ Confirmation ]
})
export class ConfirmationModule { }