import React, { useState } from 'react';
import { Button, Box, LinearProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadCsv } from '../services/api';

const CSVUploader: React.FC<{ onUploadSuccess: () => void }> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      await uploadCsv(formData, (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 1)
        );
        setProgress(percentCompleted);
      });
      
      onUploadSuccess();
      setFile(null);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box sx={{ mb: 3, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
      <input
        accept=".csv"
        style={{ display: 'none' }}
        id="csv-upload"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="csv-upload">
        <Button
          variant="contained"
          color="primary"
          component="span"
          startIcon={<CloudUploadIcon />}
          disabled={isUploading}
        >
          Select CSV File
        </Button>
      </label>
      
      {file && (
        <Box sx={{ mt: 1 }}>
          <div>Selected file: {file.name}</div>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleUpload}
            disabled={isUploading}
            sx={{ mt: 1 }}
          >
            Upload
          </Button>
        </Box>
      )}
      
      {isUploading && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Box sx={{ textAlign: 'center', mt: 1 }}>{progress}%</Box>
        </Box>
      )}
    </Box>
  );
};

export default CSVUploader;