export interface MulterFile extends Express.Multer.File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

export interface MulterError extends Error {
  code: string;
  field?: string;
} 