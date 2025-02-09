import React, { useState } from "react";
import { FaUpload, FaEye } from "react-icons/fa6";
import type { UploadProps, UploadFile } from "antd";
import { Button, Upload, message } from "antd";

interface UploaderProps {
  documentName: string;
  restrainMessage: string;
  uploadItemsCount: number;
  documentKey: string;
  onChange: (fileList: UploadFile[], key: string) => void;
  existingDocumentUrl?: string;
  loading?: boolean;
}

const Uploader: React.FC<UploaderProps> = ({
  documentName,
  restrainMessage,
  uploadItemsCount,
  documentKey,
  onChange,
  existingDocumentUrl,
  loading = false,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const props: UploadProps = {
    name: documentKey,
    beforeUpload: () => {
      return false;
    },
    onChange(info) {
      onChange(info.fileList, documentKey);

      if (info.file.status === "removed") {
        setErrorMessage(null);
        console.log(`${info.file.name} file removed`);
      }
    },
    maxCount: uploadItemsCount,
  };

  const handlePreview = () => {
    if (!existingDocumentUrl) {
      message.warning("No document available for preview");
      return;
    }

    // Always open in a new tab for signed URLs
    window.open(existingDocumentUrl, "_blank");
  };

  return (
    <>
      <div
        style={{
          border: "1px solid #D9D9D9",
          width: "100%",
          padding: "24px 16px",
          borderRadius: "8px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p style={{ fontWeight: "500", marginBottom: "12px" }}>{documentName}</p>
          {errorMessage ? (
            <p style={{ color: "red", margin: "0 0 16px 0" }}>{errorMessage}</p>
          ) : (
            <p style={{ color: "rgba(0,0,0,.45)" }}>{restrainMessage}</p>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Upload {...props}>
            <Button
              style={{ borderRadius: "8px" }}
              type="primary"
              icon={<FaUpload fontSize="13px" style={{ marginRight: "4px" }} />}
              loading={loading}
            >
              Upload
            </Button>
          </Upload>

          {existingDocumentUrl && (
            <Button
              style={{ borderRadius: "8px" }}
              type="default"
              icon={<FaEye fontSize="13px" style={{ marginRight: "4px" }} />}
              onClick={handlePreview}
            >
              View
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default Uploader;
