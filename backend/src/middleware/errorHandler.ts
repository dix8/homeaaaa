import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

interface MulterError extends Error {
  code: string;
  field?: string;
  storageErrors?: Error[];
}

export const errorHandler = (
  err: Error | MulterError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          error: 'File too large. Maximum size is 5MB'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          error: 'Too many files uploaded'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          error: 'Unexpected field'
        });
      default:
        return res.status(400).json({
          error: err.message
        });
    }
  }
  
  if (err instanceof Error) {
    return res.status(500).json({
      error: err.message || 'Something went wrong'
    });
  }

  next();
}; 