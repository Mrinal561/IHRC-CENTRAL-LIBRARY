import React, { useState } from 'react';
import { Button, Dialog, Input, toast, Notification, Card } from '@/components/ui';
import {RiUploadLine, RiDownloadLine} from 'react-icons/ri';


const TemplateCards = () => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeCard, setActiveCard] = useState(null);


  const templates = [
    "Salary Register",
    "Attendance Register",
    "Leave Register",
    "Bonus Register",
    "Maternity Register"
  ];

  const handleUploadClick = (cardIndex) => {
    setActiveCard(cardIndex);
    setIsUploadDialogOpen(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      setTimeout(() => {
        toast.push(
          <Notification title="Success" type="success">
            Document uploaded successfully
          </Notification>,
        );
        setIsUploadDialogOpen(false);
        setSelectedFile(null);
      }, 1000);
    }
  };


  const handleDownload = (cardIndex) => {
    // Simulated download logic
    toast.push(
      <Notification title="Success" type="success">
        Template downloaded successfully
      </Notification>,
    );
  };

  return (
    <div className="grid grid-cols-3 gap-8">
      {templates.map((title, index) => (
        <Card key={index} className="shadow-lg">
          <div className="flex flex-col gap-4 p-6">
            <h4 className="text-lg font-semibold h-16 flex items-center justify-center text-center">
              {title}
            </h4>
            <div className="flex space-x-5 justify-center">
              <Button
                size="sm"
                variant="solid"
                onClick={() => handleUploadClick(index)}
                className="flex items-center gap-2 px-[18px]"
                icon={<RiUploadLine />}
              >
               Input Upload
              </Button>
              <Button
                size="sm"
                variant="solid"
                onClick={() => handleDownload(index)}
                className="flex items-center gap-2 px-[18px] "
                icon={<RiDownloadLine />}
              >
               Input Download
              </Button>
            </div>
            <div className="flex space-x-5 justify-center">
              <Button
                size="sm"
                variant="solid"
                onClick={() => handleUploadClick(index)}
                className="flex items-center gap-2"
                icon={<RiUploadLine />}
              >
               Output Upload
              </Button>
              <Button
                size="sm"
                variant="solid"
                onClick={() => handleDownload(index)}
                className="flex items-center gap-2"
                icon={<RiDownloadLine />}
              >
               Output Download
              </Button>
            </div>
          </div>
        </Card>
      ))}

          <Dialog
              isOpen={isUploadDialogOpen}
              onClose={() => setIsUploadDialogOpen(false)}
          >
              <h5 className="mb-4">Upload {' '} 
              {activeCard !== null && templates[activeCard]}
              </h5>
              <p className="mb-4 text-sm text-gray-600">
            Please upload the template for {' '}
            {activeCard !== null && templates[activeCard]}
          </p>
              <div>
                  <Input
                      type="file"
                      onChange={handleFileChange}
                      className="mb-4"
                  />
              </div>
              <div className="text-right">
                  <Button
                      variant="solid"
                      onClick={handleUpload}
                      disabled={!selectedFile}
                  >
                      Upload
                  </Button>
              </div>
          </Dialog>
    </div>
  );
};

export default TemplateCards;