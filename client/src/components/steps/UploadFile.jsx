import React, { useState, forwardRef, useImperativeHandle } from 'react'
import toast, { Toaster } from 'react-hot-toast';

const UploadFile = forwardRef (({ onValidate, showErrors }, ref) => {

    // const [fileName, setFileName] = useState('');
    const [file, setFile] = useState(null);
    // const [inputError, setInputError] = useState(false);

    // const inputClass = 'border border-indigo-600 px-3 py-2 rounded-md w-full';
    const fileInputClass = 'file:bg-black file:px-5 file:py-3 file:text-white file:cursor-pointer file:hover:bg-gray-700 border border-black rounded-md w-full mt-4';

    const validateForm = () => {
        let isValid = true;
        // let newInputError = '';
        let newFileError = '';
        
        // if (!fileName.trim()) {
        //     newInputError = 'File name is required';
        //     isValid = false;
        // }

        if (!file) {
            newFileError = 'Please upload a PDF file';
            isValid = false;
            toast.error(newFileError, {
                position: 'top-right',
            });
        } else if (file.type !== 'application/pdf') {
            newFileError = 'Only PDF files are allowed';
            isValid = false;
            toast.error(newFileError, {
                position: 'top-right',
            });
        } else if (file.size > 5 * 1024 * 1024) { 
            newFileError = 'File size should not exceed 5MB';
            isValid = false;
            toast.error(newFileError, {
                position: 'top-right',
            });
        } 

        // setInputError(newInputError);

        onValidate(isValid);
        return { isValid, file };
    }

    useImperativeHandle(ref, () => ({
        validateForm
    }));


    return (
        <div className='flex flex-col justify-center mt-10 max-w-md mx-auto'>
            {/* <label htmlFor="fileName" className='mb-2 font-medium'>
                Enter file name
            </label>
            <input
                type="text"
                id="fileName"
                className={inputClass}
                onChange={(e) => setFileName(e.target.value)}
                aria-label="File Name"
            />
            {showErrors && inputError && <p className="text-red-600 text-sm">{inputError}</p>} */}
            <Toaster toastOptions={{
                style: {
                    background: 'rgb(244,150,155) linear-gradient(90deg, rgba(244,150,155,1) 0%, rgba(136,134,134,1) 51%)',
                    color: 'black',
                }
            }} />
            <input type="file" 
            // className="file:bg-indigo-600 file:px-5 file:py-3 
            // file:text-white file:cursor-pointer file:hover:bg-indigo-500 border border-indigo-600 w-full rounded-md" 
            className={fileInputClass}
            accept='application/pdf'
            onChange={(e) => setFile(e.target.files[0])}
            aria-label="Upload PDF File"
             />
        </div>
    )
})

export default UploadFile