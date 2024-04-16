import { BaseEntity } from "src/base.entity";
import { Column, Entity } from "typeorm";
import { UserRoleName } from "./userRole.types";

@Entity()
export class UserRole extends BaseEntity {
	@Column({
		unique: true,
		nullable: false
	})
	roleName: UserRoleName;
}