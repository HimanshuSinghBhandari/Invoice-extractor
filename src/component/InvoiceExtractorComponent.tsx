import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { extractTextFromPDF } from './invoiceExtractor';
import { extractDataWithGroq, ExtractedData } from '../ai/aimodel';

function cleanResponse(response: string): string {
    return response.replace(/\*\*/g, '');
  }

const InvoiceExtractorComponent: React.FC = () => {
  const [, setPdfText] = useState<string>('');
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        const text = await extractTextFromPDF(file);
        setPdfText(text);
        const data = await extractDataWithGroq(text);
        setExtractedData({
            rawResponse: cleanResponse(data.rawResponse)
        });
      } catch (error) {
        console.error('Error processing PDF:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex flex-col items-center justify-center p-4"
    >
      <motion.h1
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="text-4xl font-bold text-indigo-700 mb-8"
      >
        Invoice Extractor
      </motion.h1>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white rounded-lg shadow-lg p-6 mb-8"
      >
        <label htmlFor="file-upload" className="cursor-pointer bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300">
          Choose PDF File
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="hidden"
        />
      </motion.div>

      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg text-indigo-600 font-semibold"
        >
          Processing...
        </motion.div>
      )}

      {extractedData && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-indigo-700 mb-4">Extracted Data:</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
            {extractedData.rawResponse}
          </pre>
        </motion.div>
      )}
    </motion.div>
  );
};

export default InvoiceExtractorComponent;