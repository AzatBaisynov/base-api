import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRole } from "./userRole.entity";
import { Repository } from "typeorm";
import { UserRoleName } from "./userRole.types";

@Injectable()
export class UserRoleService implements OnApplicationBootstrap {
	constructor(
		@InjectRepository(UserRole)
		private userRoleRepository: Repository<UserRole>
	) { }

	onApplicationBootstrap() {
		this.createInitialRoles();
	}

	async createInitialRoles(): Promise<void> {
		const roleNames: UserRoleName[] = [
			UserRoleName.ADMIN, 
			UserRoleName.USER, 
			UserRoleName.SUPER_ADMIN
		]
		for (let i = 0; i < roleNames.length; i++) {
			const existingRole = await this.findRoleByRoleName(roleNames[i])
			if (!existingRole) {
				await this.userRoleRepository.save({ roleName: roleNames[i] })
			}
		}
	}

	async createUserRole(roleName: UserRoleName): Promise<UserRole> {
		return await this.userRoleRepository.create({ roleName })
	}

	async findById(id: string): Promise<UserRole> {
		return await this.userRoleRepository.findOne({
			where: {
				id
			}
		})
	}

	async findAll(): Promise<UserRole[]> {
		return await this.userRoleRepository.find()
	}

	async findRoleByRoleName(roleName: UserRoleName): Promise<UserRole> {
		return await this.userRoleRepository.findOne({
			where: {
				roleName
			}
		})
	}

}