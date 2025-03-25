import React, { useState, useRef } from 'react'
import "./stepper.css";
import { TiTick } from "react-icons/ti";
import UploadFile from './steps/UploadFile';
import ThingsToExport from './steps/ThingsToExport';
import axios from 'axios';
import DisplayTablesOrImage from './steps/DisplayTablesOrImage';
import DownloadFile from './steps/DownloadFile';

const Stepper = () => {
    const steps = ['Upload file', 'Select items', 'Custom items', 'Download file']
    const [currrentStep, setCurrentStep] = useState(1)
    const [complete, setComplete] = useState(false)
    const [isUploadValid, setIsUploadValid] = useState(false);
    const [isThingsToExport, setIsThingsToExport] = useState(false);
    const [imageOrTables, setImageOrTables] = useState(false);
    const [downloadType, setDownloadType] = useState(false);
    const [imageOrTablesOutput, setImageOrTableOutput] = useState(false);
    const [sendFileToBackend, setSendFileToBackend] = useState({fileUpload: '', exportType: '' })
    const [dataToDownload, setDataToDownload] = useState({fileSetup: '', tableData: '' })
    const [showErrors, setShowErrors] = useState(false);
    const uploadFileRef = useRef(null);
    const thingsToExportRef = useRef(null);
    const imageOrTablesRef = useRef(null);
    const downloadsRef = useRef(null);

    const sendDataToBackend = async (data) => {
        try {
            const formData = new FormData();
            formData.append('fileUpload', data.fileUpload);
            formData.append('exportType', data.exportType);
            // console.log("Backend URL:", process.env.REACT_APP_BACKEND_URL);
            const response = await axios.post(
                process.env.REACT_APP_BACKEND_URL + '/sendFileAndType',
                // `${process.env.REACT_APP_BACKEND_URL}/sendFileAndType`,
                formData, 
                { 
                    headers: { 
                        'Content-Type': 'multipart/form-data', 
                        'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`
                    },
                    timeout: 60000
                }
            );
    
            return response.data;
        } catch (error) {
            console.error('Error sending data:', error);
            return null;
        }
    }

    const stepContent = {
        1: <UploadFile onValidate={setIsUploadValid} showErrors={showErrors} ref={uploadFileRef} />,
        // 2: <p>Step 2: Choose specific items from the uploaded file for processing.</p>,
        2: <ThingsToExport onValidate={setIsThingsToExport} showErrors={showErrors} ref={thingsToExportRef} />,
        // 3: <p>Step 3: Customize the selected items based on your preferences.</p>,
        3: <DisplayTablesOrImage onValidate={setImageOrTables} showErrors={showErrors} data={imageOrTablesOutput} ref={imageOrTablesRef} />,
        // 4: <p>Step 4: Download the processed file to your device.</p>,
        4: <DownloadFile onValidate={setDownloadType} showErrors={showErrors} ref={downloadsRef}/>,
      };

      const handleNext = async () => {
        if (currrentStep === 1) {
            setShowErrors(true);
            if (uploadFileRef.current) {
                const { isValid, file } = uploadFileRef.current.validateForm();
                if (isValid) {
                    setSendFileToBackend((prevState) => ({...prevState, fileUpload: file}))
                    setCurrentStep((prev) => prev + 1);
                    setShowErrors(false);
                }
            }
        } else if (currrentStep === 2) {
            setShowErrors(true);
            if (thingsToExportRef.current) {
                const { isValid, selectedOption } = thingsToExportRef.current.validateButton();
                if (isValid) {
                    const updatedData = { ...sendFileToBackend, exportType: selectedOption };
                    setSendFileToBackend(updatedData);
                    try {
                        const returnData = await sendDataToBackend(updatedData);
        
                        if (returnData && returnData.message === 'success') {
                            setImageOrTableOutput(returnData.tables)
                            setCurrentStep((prev) => prev + 1);
                            setShowErrors(false);
                        } else {
                            console.log('Failed to process data on the backend');
                        }
                    } catch (error) {
                        console.error('Error during backend processing:');
                        // console.error('Error during backend processing:', error);
                    }
                }
            }

        } else if (currrentStep === 3) {
            setShowErrors(true);
            if (imageOrTablesRef.current) {
                const { isValid, checkedBoxData } = imageOrTablesRef.current.validateCheckBox();
                if (isValid) {
                    setDataToDownload((prevState) => ({...prevState, tableData: checkedBoxData}))
                    setCurrentStep((prev) => prev + 1);
                    setShowErrors(false);
        
                }
            }

        } else if (currrentStep === 4) {
            setShowErrors(true);
            if (downloadsRef.current) {
                const { isValid, radioFileType } = downloadsRef.current.validateType();
                if (isValid) {
                    
                    const updatedData = { ...dataToDownload, fileSetup: radioFileType};
                    // console.log('updatedData:', updatedData);
                    setDataToDownload(updatedData)
                    try {
                        // const response = await axios.post('http://localhost:5000/filesToDownload', updatedData, {
                        const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/filesToDownload', updatedData, {
                            headers: 
                                { 
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`
                                },
                            responseType: 'blob', 
                        });
        
                        if (response.status === 200) {
                            const contentType = response.headers['content-type'];
                            if (contentType.startsWith('text/csv')) {
                                const blob = new Blob([response.data], { type: 'text/csv' });
    
                                const url = window.URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = 'processed_data.csv';  
                                link.click();  
    

                                window.URL.revokeObjectURL(url);
                            } else if (contentType === 'application/zip') {
                                // console.log('ZIP file received:', response);
                                const blob = new Blob([response.data], { type: 'application/zip' });


                                const url = window.URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = 'processed_data.zip';  
                                link.click();  


                                window.URL.revokeObjectURL(url);
                            } else {
                                console.error('Unexpected content type:', contentType);
                            }

                            // setCurrentStep((prev) => prev + 1);
                            setShowErrors(false);
                        } else {
                            console.log('Failed to process data on the backend');
                        }
                    } catch (error) {
                        console.error('Error during backend processing:', error);
                    }

                    // setCurrentStep((prev) => prev - 1);
                    // setShowErrors(false);
        
                }
            }

        } else {
            currrentStep === steps.length ? setComplete(true) : setCurrentStep((prev) => prev + 1);
        }
    };

    // console.log('file', dataToDownload)

  return (
    <>
        <div className='flex justify-between mt-5'>
            {steps?.map((step,i) => (
                <div key={i} className={`step-item ${currrentStep === i + 1 && "active"} ${ (i + 1 < currrentStep || complete) && "complete"}`}>
                    <div className='step'>{(i + 1 < currrentStep || complete) ? <TiTick size={24} /> : i + 1 }</div>
                        <p className='text-black font-medium'>
                            {step}
                        </p>
                </div>
            ))}
        </div>

        <div className="step-content mt-6">
            {stepContent[currrentStep]}
        </div>
        
        <div className={`flex mt-5 justify-end `}>
            {/* {currrentStep === 2 && (
                <div className="text-left border border-black p-2 rounded-lg">
                <p>Views and Both are under maintenance</p>
                </div>
            )} */}

            {!complete && (
                <button className='btn' onClick={handleNext}>
                    {currrentStep === steps.length ? "Download" : "Next"}
                </button>
            )}
        </div>
    </>
  )
}

export default Stepper