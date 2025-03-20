import React, { useState } from 'react';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

function Sender() {
    const [clipboardData, setClipboardData] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;

        let newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 3) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (index, event) => {
        if (event.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    const fetchClipboardData = async () => {
        const code = otp.join('');
        if (code.length !== 4) {
            alert('❌ Please enter a 4-digit code.');
            return;
        }

        try {
            const response = await axios.get(`${apiUrl}/api/clipboard/${code}`, {
                withCredentials: true, // 👈 Added this line
            });
            console.log('Response:', response.data);

            if (response.data.data) {
                await navigator.clipboard.writeText(response.data.data);
                alert('✅ Clipboard data copied successfully!');
            } else {
                alert('❌ No data found for this code.');
            }
        } catch (error) {
            console.error('Error fetching clipboard data:', error);
            alert('❌ Failed to retrieve clipboard data.');
        }
    };

    const getClipboardData = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (!text.trim()) {
                alert('❌ Clipboard is empty.');
                return;
            }

            setClipboardData(text);
            const response = await axios.post(`${apiUrl}/api/clipboard`, { data: text }, {
                withCredentials: true, // 👈 Added this line
            });

            setGeneratedCode(response.data.code);
            alert('✅ Clipboard data sent successfully!');
        } catch (error) {
            console.error('Error reading clipboard:', error);
        }
    };

    return (
        <div className='h-[93.5vh] bg-slate-600 text-white w-full pt-10 flex flex-col items-center'>
            <main className="p-4 flex flex-col gap-8 text-center">
                <p className="text-2xl font-medium">
                    Copy Remotely To Your Clipboard <br /> Just by code...
                </p>

                {/* Paste Button */}
                <div className="flex flex-col items-center">
                    <button className='bg-black text-white px-4 py-2 rounded' onClick={getClipboardData}>
                        Paste
                    </button>
                    <span className='text-xs font-mono mt-1'>*Click to generate code</span>
                    {generatedCode && (
                        <p className="mt-2 text-lg">
                            Generated Code: <strong className="text-green-400">{generatedCode}</strong>
                        </p>
                    )}
                </div>

                {/* OTP Input and Fetch Button */}
                <div className="flex flex-col items-center">
                    {/* OTP Input Fields */}
                    <div className="flex gap-3 mt-3">
                        {otp.map((num, index) => (
                            <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            maxLength="1"
                            value={num}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-14 h-14 text-3xl text-black font-bold bg-white border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ))}
                    </div>
                    <br />
                    <button className='bg-black text-white px-4 py-2 rounded' onClick={fetchClipboardData}>
                        Fetch
                    </button>
                    <span className='text-xs font-mono mt-1'>*Enter code below to fetch data</span>
                </div>
            </main>
        </div>
    );
}

export default Sender;
