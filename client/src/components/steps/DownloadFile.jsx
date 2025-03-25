import React, { useState, forwardRef, useImperativeHandle } from 'react'
import toast, { Toaster } from 'react-hot-toast';

const DownloadFile = forwardRef(({ onValidate, showErrors }, ref) => {

    const [selectedOption, setSelectedOption] = useState('');

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const validateType = () => {
        let isValid = true;
        let btnError = ''

        if(!selectedOption) {
            btnError = 'Please choose the type';
            isValid = false;
            toast.error(btnError, {
                position: 'top-right',
            });
        }

        onValidate(isValid);
        return { isValid, radioFileType: selectedOption };
        
    }

    useImperativeHandle(ref, () => ({
        validateType
    }))

  return (
    <div>
        <div className='border border-gray-300 bg-black rounded-lg p-6 max-w-4xl mx-auto mt-8'>
            <Toaster toastOptions={{
                style: {
                    background: 'rgb(244,150,155) linear-gradient(90deg, rgba(244,150,155,1) 0%, rgba(136,134,134,1) 51%)',
                    color: 'black',
                }
            }} />
            <h2 className="text-xl font-semibold mb-4 text-white">Select a type to download .?</h2>
            <div className="space-y-2 text-white">
                <label className="flex items-center space-x-2">
                <input
                    type="radio"
                    value="single"
                    checked={selectedOption === 'single'}
                    onChange={handleOptionChange}
                    className="appearance-none h-3 w-3 border border-gray-300 rounded-full checked:bg-indigo-500
                    checked:border-white focus:outline-none focus:ring-3 focus:ring-indigo-500"
                />
                <span>Single file</span>
                </label>
                <label className="flex items-center space-x-2">
                <input
                    type="radio"
                    value="multiple"
                    checked={selectedOption === 'multiple'}
                    onChange={handleOptionChange}
                    className="appearance-none h-3 w-3 border border-gray-300 rounded-full checked:bg-indigo-500
                    checked:border-white focus:outline-none focus:ring-3 focus:ring-indigo-500"
                />
                <span>Multiple file</span>
                </label>
            </div>
    </div>
    </div>
  )
})

export default DownloadFile