import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { storeFileInCache, retrieveFileFromCache } from "@/utils/cryptoUtils"; // Import utilities

export default function Component() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [retrieveOptions, setRetrieveOptions] = useState<string[]>([]);
  const [output, setOutput] = useState<JSX.Element | string>("");

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Handle file storage (encryption + cache)
  const handleStoreFile = async () => {
    if (selectedFile) {
      try {
        // Store the file in cache (encrypted)
        await storeFileInCache(selectedFile);
        // Add the file name to the retrieveOptions state
        setRetrieveOptions((prev) => [...prev, selectedFile.name]);
        setSelectedFile(null);
        setOutput(`File "${selectedFile.name}" stored successfully.`);
      } catch (error) {
        console.error("Error storing file:", error);
        setOutput("Error storing file.");
      }
    }
  };

  // Handle file retrieval (decryption + output)
  const handleRetrieveFile = async (fileName: string) => {
    try {
      // Retrieve the file from the cache (decrypted)
      const fileBlob = await retrieveFileFromCache(fileName);
      const url = URL.createObjectURL(fileBlob);

      // Display the retrieved file based on its type
      if (fileBlob.type.startsWith("image/")) {
        setOutput(<img src={url} alt={fileName} />);
      } else if (fileBlob.type === "application/pdf") {
        setOutput(
          <iframe
            src={url}
            width="100%"
            height="600px"
            title={fileName}
          ></iframe>
        );
      } else {
        setOutput(
          <a href={url} download={fileName}>
            Download {fileName}
          </a>
        );
      }
    } catch (error) {
      console.error("Error retrieving file:", error);
      setOutput("Error retrieving file.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Upload and Securely Cache Files
      </h1>

      {/* File Upload */}
      <div className="mb-8">
        <p className="mb-2">Select a file to upload:</p>
        <div className="flex items-center gap-2 mb-4">
          <Input
            type="file"
            onChange={handleFileChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
        </div>
        <Button
          onClick={handleStoreFile}
          disabled={!selectedFile}
          className="w-full"
        >
          Store File in Cache
        </Button>
      </div>

      {/* File Retrieval */}
      <h2 className="text-xl font-bold mb-4">Retrieve a File</h2>
      <div className="mb-4">
        <p className="mb-2">Select a file to retrieve:</p>
        <Select onValueChange={handleRetrieveFile}>
          <SelectTrigger>
            <SelectValue placeholder="Select a file to retrieve" />
          </SelectTrigger>
          <SelectContent>
            {retrieveOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Output section for displaying retrieved files */}
      <div className="output-section mt-4">{output}</div>
    </div>
  );
}
