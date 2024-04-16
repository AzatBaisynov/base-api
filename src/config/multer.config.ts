import { diskStorage } from 'multer';
import { extname, resolve } from 'path';

export const multerConfig = (destination: string) => ({
	storage: diskStorage({
		/* TODO: Check on Ubuntu */
		// destination: resolve(__dirname, '..', '..', destination),
		destination,
		filename: (req, file, cb) => {
			try {
				const randomName = Date.now() + '-' + Math.round(Math.random() * 1E9);
				return cb(null, `${randomName}${extname(file.originalname)}`);
			} catch (error) {
				return cb(error, null);
			}
		},
	}),
});

