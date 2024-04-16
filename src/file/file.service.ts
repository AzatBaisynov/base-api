import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { File } from "./file.entity";
import { Repository } from "typeorm";
import { IFile } from "./file.types";
import { unlink } from "fs/promises";

@Injectable()
export class FileService {
	constructor(
		@InjectRepository(File)
		private fileRepository: Repository<File>
	) {}
	
	async createFile(uploadedFile: IFile): Promise<File> {
		return this.fileRepository.save(uploadedFile);
	}

	async findById(fileId: string): Promise<File> {
		return this.fileRepository.findOneBy({ id: fileId })
	}

	async deleteFile(fileId: string) {
		const file = await this.findById(fileId)
		try {
			await unlink(file.path)
		} catch(err) {
			throw new HttpException("Can not delete file", HttpStatus.INTERNAL_SERVER_ERROR)
		}
		
		this.fileRepository
			.createQueryBuilder()
			.delete()
			.where("id = :id", { id: fileId })
			.execute()
	}

	
}