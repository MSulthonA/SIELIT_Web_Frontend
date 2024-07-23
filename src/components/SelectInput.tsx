import Select, { ActionMeta, SingleValue } from 'react-select'

type SelectInputProps = {
    title: string
    name: string
    values: { value: string; label: string; }[]
    value: string
    onChange: (e: {target: {value: string, name: string}}) => void
    errorMsg?: string
    className?: string
}

function SelectInput({title, name, values, value, onChange, errorMsg, className}: SelectInputProps) {
    
    function translate(val: any){
        onChange({target: {value: val.value, name: name}})
    }

    let usedValue = values.filter(el => el.value == value);

    return ( 
        <div className={`relative ${className}`}>
            <p className={`absolute left-4 font-bold ${value === '' ? 'top-5 text-sm' : 'top-2 text-xs'} ${errorMsg ? 'text-red-400' : 'text-stone-400'}  transition-all duration-200 z-10`}>{errorMsg ? title + ' ' + errorMsg : title}</p>
            <Select options={values} onChange={translate} value={usedValue}
                styles={{
                    placeholder: (baseStyles, state) => ({
                        ...baseStyles,
                        display: 'none'
                    }),
                    control: (baseStyles, state) => ({
                    ...baseStyles,
                        border: 'none',
                        borderColor: state.isFocused ? 'green' : '',
                        backgroundColor: '#ffffff',
                        padding: state.hasValue ? '18px 10px 2px 6px' : '10px',
                        borderRadius: '12px',
                        marginBottom: '24px',
                        fontWeight: 'bold'
                    }),
                    dropdownIndicator: (baseStyles, state) => ({
                        ...baseStyles,
                        transform: state.hasValue ? 'translateY(-8px)' : ''
                    }),
                    indicatorSeparator: (baseStyles, state) => ({
                        ...baseStyles,
                        transform: state.hasValue ? 'translateY(-8px)' : ''
                    }),
                    menu: (baseStyles, state) => ({
                        ...baseStyles,
                        zIndex: '20',
                        backgroundColor: '#ffffff',
                    })
                }}
            />
        </div>
    );
}

export default SelectInput;