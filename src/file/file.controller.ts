import { Controller, Get, Param, ParseFilePipeBuilder, Post, Res, StreamableFile, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileService } from "./file.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { createReadStream } from "fs";
import { Response } from "express";

@Controller('files')
export class FileController {
	constructor(
		private readonly fileService: FileService
	) { }

	@Post()
	@UseInterceptors(FileInterceptor('file'))
	uploadFile(
		@UploadedFile(
			new ParseFilePipeBuilder()
				.addMaxSizeValidator({
					maxSize: 5242880
				})
				.addFileTypeValidator({
					fileType: /[^\s]+(.*?).(jpg|jpeg|png|JPG|JPEG|PNG)$/
				})
				.build()
		) file: Express.Multer.File
	) {
		return this.fileService.createFile(file)
	}
	
	@Get(':fileId')
	async getFile(@Param("fileId") fileId: string, @Res({ passthrough: true }) res: Response) {
		const fileDB = await this.fileService.findById(fileId)
		const file = createReadStream(fileDB.path)

		res.set({
			'Content-Type': fileDB.mimetype,
			'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(fileDB.originalname)}`
		})

		return new StreamableFile(file)
	}
}