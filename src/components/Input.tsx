type Props = {
    placeholder: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function Input({ placeholder, value, onChange }: Props) {
    return (
        <input
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="border rounded p-2 w-1/3"
        />
    );
}