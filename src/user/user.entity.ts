import { BaseEntity } from "src/base.entity";
import { BeforeInsert, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne } from "typeorm";
import { UserInterface, UserStatus } from "./user.types";
import { hash } from "bcrypt";
import { Confirmation } from "src/confirmation/confirmation.entity";
import { UserRole } from "src/userRole/userRole.entity";
import { File } from "src/file/file.entity";

@Entity()
export class User extends BaseEntity implements UserInterface {
	@Column({
		nullable: false
	})
	fullName: string

	/* NotNullable */
	@Column({
		unique: true,
		nullable: false
	})
	username: string

	/* NotNullable */
	@Column({
		unique: true,
		nullable: false
	})
	email: string

	/* NotNullable */
	@Column({
		nullable: false
	})
	password: string

	/* NotNullable */
	@Column({
		nullable: false
	})
	status: UserStatus

	/* NotNullable */
	@Column({
		nullable: true
	})
	refreshToken: string

	@ManyToMany(() => UserRole)
	@JoinTable()
	roles: UserRole[]

	@OneToOne(() => File)
	@JoinColumn()
	userPhoto: File

	@ManyToOne(() => Confirmation)
	emailConfirmation: Confirmation


	@BeforeInsert()
	async hashPassword() {
		this.password = await hash(this.password, 10)
	}
}