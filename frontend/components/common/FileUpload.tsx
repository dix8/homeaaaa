import React, { useRef } from 'react';
import Api from '../../utils/api';

interface FileUploadProps {
  type: 'avatar' | 'project' | 'favicon' | 'logo';
  onUploadSuccess: (url: string) => void;
  onUploadError: (error: string) => void;
  buttonText: string;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  type,
  onUploadSuccess,
  onUploadError,
  buttonText,
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const response = await Api.uploadFile(file, type);
      if (response.error) {
        onUploadError(response.error);
        return;
      }
      if (response.data?.url) {
        onUploadSuccess(response.data.url);
      }
    } catch (error) {
      onUploadError(error instanceof Error ? error.message : '上传失败');
    } finally {
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept={type === 'favicon' ? '.ico,.png' : '.jpg,.jpeg,.png'}
      />
      <button
        type="button"
        onClick={handleClick}
        className={className}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default FileUpload; 