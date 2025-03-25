import React, { useState, forwardRef, useImperativeHandle } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import "./scrollbar.css"

const DisplayTablesOrImage = forwardRef(({ onValidate, showErrors, data }, ref) => {
    // console.log('data', data)    

    const tables = Array.isArray(data) ? data : [];

    const [checkedTables, setCheckedTables] = useState({});
    const [customNames, setCustomNames] = useState({});
    const [checkBoxError, setCheckBoxError] = useState('');

    const handleCheckboxChange = (tableIndex) => {
        setCheckedTables(prev => ({
            ...prev,
            [tableIndex]: !prev[tableIndex]
        }));
        // console.log('checkedTables: ',checkedTables)
    };

    const handleCustomNameChange = (tableIndex, value) => {
        setCustomNames(prev => ({
            ...prev,
            [tableIndex]: value
        }));
    };

    const handleSelectAll = () => {
        const allChecked = Object.values(checkedTables).every(Boolean) && Object.keys(checkedTables).length === tables.length;
        const newCheckedTables = {};
        tables.forEach((_, index) => {
            newCheckedTables[index] = !allChecked;
        });
        setCheckedTables(newCheckedTables);
    };

    const validateCheckBox = () => {
        let isValid = true;
        let checkError = ''

        const selectedIndexes = Object.entries(checkedTables)
            .filter(([, isChecked]) => isChecked)
            .map(([index]) => parseInt(index, 10));

        if(selectedIndexes.length === 0) {
            isValid = false;
            checkError = 'Please choose the checkbox to proceed';
            toast.error(checkError, {
                position: 'top-right',
            });
        }
        
        // const rawData = tables.filter((_, idx) => selectedIndexes.includes(idx))
        // const checkedBoxData = rawData.map(table => ({
        //     headers: table.headers,
        //     rows: table.rows,
        // }));

        const checkedBoxData = selectedIndexes.map(idx => ({
            headers: tables[idx].headers,
            rows: tables[idx].rows,
            customName: customNames[idx] || `Table ${idx + 1}` // Include custom name or default name
        }));

        setCheckBoxError(checkError)
        onValidate(isValid);
        // console.log('checkedBoxData: ', checkedBoxData)
        return { isValid, checkedBoxData };
    }
    
    
    useImperativeHandle(ref, () => ({
        validateCheckBox
    }));
    
    if (tables.length === 0) {
        return <div className="text-white">No table data available.</div>;
    }

    const totalChecked = Object.values(checkedTables).filter(Boolean).length;

  return (

    // <div className='border border-gray-300 bg-black rounded-lg p-6 max-w-4xl mx-auto max-h-[500px] overflow-y-auto mt-8 text-white custom-scrollbar'>
    <div className="max-w-4xl mx-auto mt-8 text-white">
        <Toaster toastOptions={{
            style: {
                background: 'rgb(244,150,155) linear-gradient(90deg, rgba(244,150,155,1) 0%, rgba(136,134,134,1) 51%)',
                color: 'black',
            }
        }} />
        <div className="flex justify-between items-center bg-black p-2  rounded-t-lg">
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="select-all"
                    checked={Object.values(checkedTables).every(Boolean) && Object.keys(checkedTables).length === tables.length}
                    onChange={handleSelectAll}
                    className="mr-3 h-4 w-4 ml-4 accent-indigo-600 cursor-pointer"
                />
                <label htmlFor="select-all" className="text-lg font-bold">SELECT ALL</label>
            </div>
            <span className="text-sm text-gray-400">
                {totalChecked} / {tables.length} selected
            </span>
        </div>
        
        <div className='bg-black rounded-b-lg max-h-[500px] overflow-y-auto custom-scrollbar'>
            {tables.map((table, tableIndex) => (
                <div key={tableIndex} className="p-6 border-b border-gray-700 last:border-b-0">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id={`table-checkbox-${tableIndex}`}
                                checked={checkedTables[tableIndex] || false}
                                onChange={() => handleCheckboxChange(tableIndex)}
                                className="mr-3 h-4 w-4 accent-indigo-600 cursor-pointer"
                            />
                            <h3 className="text-xl font-bold">Table {tableIndex + 1}</h3>
                            <input 
                                type="text"
                                className="bg-white ml-5 rounded-md text-black px-2"
                                placeholder="Custom Table Name"    
                                value={customNames[tableIndex] || ''}
                                onChange={(e) => handleCustomNameChange(tableIndex, e.target.value)}
                            />
                            </div>
                            <span className="text-sm text-gray-400">
                            {table.rows.length} rows
                            </span>
                    </div>

                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full border-collapse border border-gray-500 mt-4">
                            <thead >
                                <tr>
                                    {table.headers.map((header, headerIndex) => (
                                        <th key={headerIndex} className="border border-gray-500 p-2 bg-gray-700 text-white">
                                            {header || `Column ${headerIndex + 1}`}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {table.rows.map((row, rowIndex) => (
                                    <tr key={rowIndex} className="odd:bg-gray-800 even:bg-gray-900">
                                        {row.map((cell, cellIndex) => (
                                            <td key={cellIndex} className="border border-gray-500 p-2 text-gray-300">
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>

    </div>
    
    );
});

export default DisplayTablesOrImage