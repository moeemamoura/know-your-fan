import { useState } from "react";

type Props = {
    onFileSelect: (file: File) => void;
};

export function Upload({ onFileSelect }: Props) {

    const [fileName, setFileName] = useState<string>('');

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            onFileSelect(file);
        }
    }
    return (
        <div className="flex flex-col justify-center w-1/2">
            <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="block text-sm w-full text-gray-500 
                        file:
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
            />
            {fileName && <p className="flex flex-col text-sm text-gray-600">
            </p>}
        </div>
    );
}