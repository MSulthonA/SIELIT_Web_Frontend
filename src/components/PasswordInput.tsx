import { useState } from "react"
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai'

type TextInputProps = {
    title: string
    name: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    errorMsg: string
    className?: string
    inputClassName?: string
}


function PasswordInput({title, name, value, onChange, errorMsg, className, inputClassName}: TextInputProps) {
    const [showPassword, setShowPassword] = useState(false)


    return ( 
        <div className={`relative mb-6 ${className}`}>
            <p className={`absolute left-4  font-bold ${value === '' ? 'top-4 text-sm' : 'top-2 text-xs'} ${errorMsg != '' ? 'text-red-400' : 'text-stone-400'} transition-all duration-200 pointer-events-none w-10/12`}>{errorMsg != '' ? title + ' ' + errorMsg : title}</p>
            <input value={value} type={showPassword ? 'text' : 'password'} name={name} autoComplete="on" className={`bg-[#f5f5f5] focus:bg-[#f9f9f9] font-bold text-lg px-4 ${value === '' ? 'py-4' : 'pt-6 pb-2'}  ${inputClassName} rounded-md w-full focus:outline-none focus:border-2 focus:border-themeDarkGreen/75 focus:shadow focus:shadow-themeGreen`} onChange={ e => {
                onChange(e);
            }}/>
            {
                showPassword ?
                <AiOutlineEye className='absolute right-3 top-[56.5%] -translate-y-4 cursor-pointer' fontSize='1.5rem' onClick={() => setShowPassword(false)}/>
                :
                <AiOutlineEyeInvisible className='absolute right-3 top-[56.5%] -translate-y-4 cursor-pointer' fontSize='1.5rem' onClick={() => setShowPassword(true)}/>
            }
        </div>
    );
}

export default PasswordInput;