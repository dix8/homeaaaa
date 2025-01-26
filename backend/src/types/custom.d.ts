declare module 'multer' {
  import { Request } from 'express';
  
  interface File extends Express.Multer.File {}
  
  interface Options {
    dest?: string;
    storage?: any;
    limits?: {
      fieldNameSize?: number;
      fieldSize?: number;
      fields?: number;
      fileSize?: number;
      files?: number;
      parts?: number;
      headerPairs?: number;
    };
    fileFilter?: (req: Request, file: File, callback: (error: Error | null, acceptFile: boolean) => void) => void;
    preservePath?: boolean;
  }

  interface Instance {
    single(fieldname: string): any;
    array(fieldname: string, maxCount?: number): any;
    fields(fields: Array<{ name: string; maxCount?: number }>): any;
    none(): any;
  }

  function multer(options?: Options): Instance;
  
  export = multer;
} 