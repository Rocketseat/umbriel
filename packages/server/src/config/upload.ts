import multer from 'multer';
import path from 'path';

interface UploadConfig {
  driver: 'multer';

  tmpDir: string;

  config: {
    multer: multer.Options;
  };
}

export default {
  driver: 'multer',

  tmpDir: path.resolve(__dirname, '..', '..', 'tmp'),

  config: {
    multer: {
      storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'tmp'),
        filename(req, file, cb) {
          const now = Date.now();

          cb(null, `${now}-${file.originalname}`);
        },
      }),
    },
  },
} as UploadConfig;
