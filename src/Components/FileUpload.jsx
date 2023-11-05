/* eslint-disable react/prop-types */

import { FaUpload } from "react-icons/fa";
import { useDropzone } from "react-dropzone";

const FileUpload = ({ handleImageUpload }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleImageUpload,
  });

  return (
    <div className="file-upload">
      <div {...getRootProps()} className="upload-container">
        <input {...getInputProps()} />

        <div className="upload-button  p-4 text-center mx-auto  bg-[#6D214F]">
          <label className="mt-24 btn btn-error font-bold text-[18px] w-[300px] h-[100px] p-6">
            <FaUpload /> Upload from your device
          </label>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
