import React, { useState, forwardRef, useImperativeHandle } from 'react'
import toast, { Toaster } from 'react-hot-toast';

const ThingsToExport = forwardRef(({ onValidate, showErrors }, ref) => {

    const [selectedOption, setSelectedOption] = useState('');

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const validateButton = () => {
        let isValid = true;
        let btnError = ''

        if(!selectedOption) {
          isValid = false;
          btnError = 'Please choose the item';
          toast.error(btnError, {
            position: 'top-right',
          });
        }

        // setSelectedOptionError(btnError)
        // isValid = false;
        // console.log(selectedOption)
        onValidate(isValid);
        return { isValid, selectedOption };
        
    }

    useImperativeHandle(ref, () => ({
        validateButton
    }))


  return (
    <div className='border border-gray-300 bg-black rounded-lg p-6 max-w-4xl mx-auto mt-8'>
       <Toaster toastOptions={{
            style: {
                background: 'rgb(244,150,155) linear-gradient(90deg, rgba(244,150,155,1) 0%, rgba(136,134,134,1) 51%)',
                color: 'black',
            }
        }} />
        <h2 className="text-xl font-semibold mb-4 text-white">Things to Export</h2>
      <div className="space-y-2 text-white">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="views"
            checked={selectedOption === 'views'}
            onChange={handleOptionChange}
            className="appearance-none h-3 w-3 border border-gray-300 rounded-full checked:bg-indigo-500
             checked:border-white focus:outline-none focus:ring-3 focus:ring-indigo-500"
          />
          <span>Component Views</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="table"
            checked={selectedOption === 'table'}
            onChange={handleOptionChange}
            // className="form-radio text-indigo-600"
            className="appearance-none h-3 w-3 border border-gray-300 rounded-full checked:bg-indigo-500
             checked:border-white focus:outline-none focus:ring-3 focus:ring-indigo-500"
          />
          <span>Tables</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="both"
            checked={selectedOption === 'both'}
            onChange={handleOptionChange}
            // className="form-radio text-red-500 focus:ring-red-500"
            className="appearance-none h-3 w-3 border border-gray-300 rounded-full checked:bg-indigo-500
             checked:border-white focus:outline-none focus:ring-3 focus:ring-indigo-500"
          />
          <span>Both (Views & Tables)</span>
        </label>
        {/* {showErrors && selectedOptionError && <p className="text-red-600 text-sm">{selectedOptionError}</p>} */}
      </div>
    </div>
  )
})

export default ThingsToExport