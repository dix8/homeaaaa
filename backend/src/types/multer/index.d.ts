import { Request } from 'express';

declare module 'express' {
  interface Request {
    file?: Express.Multer.File;
    files?: Express.Multer.File[];
  }
}

declare module 'multer' {
  namespace Multer {
    /** Object containing file metadata and access information. */
    interface File {
      /** Name of the form field associated with this file. */
      fieldname: string;
      /** Name of the file on the uploader's computer. */
      originalname: string;
      /** Value of the `Content-Type` header for this file. */
      mimetype: string;
      /** Size of the file in bytes. */
      size: number;
      /** `DiskStorage` only: Directory to which this file has been uploaded. */
      destination: string;
      /** `DiskStorage` only: Name of this file within `destination`. */
      filename: string;
      /** `DiskStorage` only: Full path to the uploaded file. */
      path: string;
      /** `MemoryStorage` only: A Buffer containing the entire file. */
      buffer: Buffer;
      /** Encoding type of the file */
      encoding: string;
    }

    interface StorageEngine {
      _handleFile(req: Request, file: File, callback: (error?: any, info?: Partial<File>) => void): void;
      _removeFile(req: Request, file: File, callback: (error: Error) => void): void;
    }

    interface DiskStorageOptions {
      /** A function used to determine within which folder the uploaded files should be stored. Defaults to the system's default temporary directory. */
      destination?: string | ((req: Request, file: File, callback: (error: Error | null, destination: string) => void) => void);
      /** A function used to determine what the file should be named inside the folder. */
      filename?(req: Request, file: File, callback: (error: Error | null, filename: string) => void): void;
    }
  }

  interface Options {
    /** Storage engine to use for uploaded files. */
    storage?: Multer.StorageEngine;
    /** Directory to which uploaded files will be stored (DiskStorage) */
    dest?: string;
    /** Limits of the uploaded data */
    limits?: {
      /** Max field name size (Default: 100 bytes) */
      fieldNameSize?: number;
      /** Max field value size (Default: 1MB) */
      fieldSize?: number;
      /** Max number of non-file fields (Default: Infinity) */
      fields?: number;
      /** Max size of each file (Default: Infinity) */
      fileSize?: number;
      /** Max number of file fields (Default: Infinity) */
      files?: number;
      /** Max number of parts (fields + files) (Default: Infinity) */
      parts?: number;
      /** Max number of headers (Default: 2000) */
      headerPairs?: number;
    };
    /** Keep the full path of files instead of just the base name */
    preservePath?: boolean;
    /** Function to control which files are uploaded */
    fileFilter?(req: Request, file: Multer.File, callback: (error: Error | null, acceptFile: boolean) => void): void;
  }

  interface Instance {
    /** Accept a single file with the name fieldname. */
    single(fieldname: string): any;
    /** Accept an array of files, all with the name fieldname. */
    array(fieldname: string, maxCount?: number): any;
    /** Accept a mix of files, specified by fields. */
    fields(fields: Array<{ name: string; maxCount?: number }>): any;
    /** Accept only text fields. */
    none(): any;
  }

  function diskStorage(options: Multer.DiskStorageOptions): Multer.StorageEngine;
  function memoryStorage(): Multer.StorageEngine;

  /** Creates a new Multer instance with the specified options. */
  function multer(options?: Options): Instance;

  export = multer;
} 