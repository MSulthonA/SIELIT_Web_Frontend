
type TextInputProps = {
    title: string
    name: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    errorMsg?: string
    className?: string
    inputClassName?: string
}


function TextInput({title, name, value, onChange, errorMsg, className, inputClassName}: TextInputProps) {
    return ( 
        <div className={`relative ${className}`}>
            <p className={`absolute left-4  font-bold ${value === '' ? 'top-4 text-sm' : 'top-2 text-xs'} ${errorMsg ? 'text-red-400' : 'text-stone-400'} transition-all duration-200 pointer-events-none`}>{errorMsg ? title + ' ' + errorMsg : title}</p>
            <input type='text' value={value} name={name} autoComplete="on" className={`bg-[#f5f5f5] focus:bg-[#f9f9f9] font-bold text-lg px-4 ${value === '' ? 'py-4' : 'pt-6 pb-2'} rounded-xl w-full focus:outline-none focus:border-2 focus:border-themeDarkGreen/75 focus:shadow focus:shadow-themeGreen ${inputClassName}`} onChange={ e => {
                onChange(e);
            }}/>
        </div>
    );
}

export default TextInput;