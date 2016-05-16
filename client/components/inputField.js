import React from 'react'

export default function InputField(p) {
    return (
        <div className="input-field">
            <input value={p.value} placeholder={p.placeholder} type={p.type} id={p.id} onChange={p.change}/>
            <label for={p.id} className="active">{p.label}</label>
            {p.error ?
                (<div className='error'>
                    {p.error}
                </div>) :
                null
            }
        </div>
    );
};
