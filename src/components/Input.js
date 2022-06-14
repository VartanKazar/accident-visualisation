import React from 'react';

const Input = ({
    onChange, 
    name, 
    placeholder=undefined,
    type="text",
    spellCheck=false,
    wrap=undefined,
    label=undefined,
    style=undefined,
    value=undefined,
    accept=undefined
}) => {

    const handleChange = (e) => {
        const val = e.target.value

        //Make sure input contains only numbers if the type of the input is "number".
        if(type === "number"){

            var regex=/^[0-9]+$/;

            //If input is not a number, flag an error
            if(val.match(regex) || val === "")
                onChange(e)
        }

        else{
            onChange(e)
        }
    }

    const inputProps = () => {

        let properties = {
            onChange: handleChange,
            className: 'input',
            type: type
        }

        if(name){
            properties.id=name
            properties.name=name
            properties.key=name
        }

        if(placeholder)
            properties.placeholder = placeholder

        if(spellCheck)
            properties.spellCheck = spellCheck

        if(wrap)
            properties.wrap = wrap

        if(style)
            properties.style = style

        if(value)
            properties.value = value

        if(accept)
            properties.accept = accept

        return properties
    }

    const baseInput = (
        <input 
        {...inputProps()}
        />
    )

    return (
        (label) ?
        <label
        className='label'
        htmlFor={name}
        style={style ? style : {
            width: "min-content"
        }}
        >
            {label}
            {baseInput}
        </label>

        :

        baseInput
    )
}

export default Input;