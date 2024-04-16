import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Confirmation } from "./confirmation.entity";
import { ConfirmationStatus, EmailConfirmation } from "./confirmation.types";

@Injectable()
export class ConfirmationService {
	constructor(
		@InjectRepository(Confirmation)
		private confirmationRepository: Repository<Confirmation>
	) { }

	async findAll(): Promise<Confirmation[]> {
		return await this.confirmationRepository.find()
	}

	async findOneActiveByConfirmationCode(code: string): Promise<Confirmation> {
		return await this.confirmationRepository.findOne({
			where: {
				code,
				isActive: true
			}
		})
	}

	async findById(id: string): Promise<Confirmation | null> {
		const confirmations = await this.confirmationRepository.findOne({
			where: {
				id
			}
		})
		return confirmations
	}

	private async generateRandomCode() {
		const randomCode = Math.random().toString().slice(2, 8)
		const existCode = await this.findOneActiveByConfirmationCode(randomCode)
		if (existCode) {
			return await this.generateRandomCode()
		}
		return randomCode;
	}

	async createEmailConfirmation(): Promise<EmailConfirmation> {
		const randomCode = await this.generateRandomCode();
		return await this.confirmationRepository.save(
			{
				code: randomCode,
				attempts: 3,
				confirmationStatus: ConfirmationStatus.PENDING
			}
		)
	}

	async confirmEmailConfirmation(code: string, emailConfirmation: EmailConfirmation): Promise<EmailConfirmation> {
		if (!emailConfirmation.isActive) {
			throw new HttpException('Code is inactive', HttpStatus.BAD_REQUEST)
		}
		if (emailConfirmation.code !== code && emailConfirmation.attempts > 1) {
			await this.confirmationRepository.update(emailConfirmation.id, { attempts: emailConfirmation.attempts - 1 })
			return await this.findById(emailConfirmation.id)
		} else if (emailConfirmation.code !== code && emailConfirmation.attempts === 1) {
			await this.confirmationRepository.update(
				emailConfirmation.id,
				{
					attempts: 0,
					isActive: false,
					confirmationStatus: ConfirmationStatus.DECLINED
				}
			)
			return await this.findById(emailConfirmation.id)
		}
		await this.confirmationRepository.update(
			emailConfirmation.id,
			{
				isActive: false,
				confirmationStatus: ConfirmationStatus.ACTIVATED
			}
		)
		return await this.findById(emailConfirmation.id)
	}

	/**
 * @param {string} confirmation_id - Confirmation id should be the real one, not existing confirmation make create a problem.
 */
	async closeConfirmation(confirmation_id: string): Promise<Confirmation> {
		await this.confirmationRepository.update(
			confirmation_id,
			{ 
				isActive: false, 
				confirmationStatus: ConfirmationStatus.DECLINED 
			}
		)
		return await this.findById(confirmation_id)
	}
}