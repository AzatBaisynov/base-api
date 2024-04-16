import { BaseEntity } from "src/base.entity";
import { Column, Entity } from "typeorm";
import { IFile } from "./file.types";

@Entity()
export class File extends BaseEntity implements IFile {
	@Column()
	originalname: string;
	@Column()
	encoding: string;
	@Column()
	mimetype: string;
	@Column()
	destination: string;
	@Column()
	filename: string;
	@Column()
	path: string;
	@Column()
	size: number;
}