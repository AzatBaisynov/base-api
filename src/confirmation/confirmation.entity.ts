import { BaseEntity } from "src/base.entity";
import { Column, Entity } from "typeorm";
import { ConfirmationStatus, EmailConfirmation } from "./confirmation.types";

@Entity()
export class Confirmation extends BaseEntity implements EmailConfirmation {
	@Column({
		nullable: false
	})
	code: string

	@Column({
		default: true
	})
	isActive: boolean

	@Column({
		default: ConfirmationStatus.PENDING
	})
	confirmationStatus: ConfirmationStatus

	@Column({ 
		type: "timestamp", 
		nullable: true 
	})
	expirationDateTime?: Date

	@Column({
		nullable: true
	})
	attempts?: number
}