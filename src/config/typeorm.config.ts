import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { join } from "path"

export const typeOrmConfig = (
	host: string,
	port: number,
	username: string,
	password: string,
	database: string,
	synchronize: boolean
): TypeOrmModuleOptions => {
	return {
		type: 'postgres',
		host,
		port,
		username,
		password,
		database,
		entities: [
			join(__dirname, '../', '**', '*.entity.{ts,js}')
		],
		synchronize,
	}
}