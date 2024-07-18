import React from 'react';
import Label from "../atoms/Label";
import Input from "../atoms/Input";

function GroupInputTable({ htmlFor, classNameLabel, txt, type, id, name, value, onChange, onBlur, classNameInput }) {
    return (
    <div className="form-group mb-4">
        <Label
        htmlFor={htmlFor}
        classNameLabel={classNameLabel}
        txt={txt}
        />
    {type === 'textarea' ? (
        <textarea
        id={id}
        name={name}
        value={value}
        className={classNameInput}
        onChange={onChange}
        onBlur={onBlur}
        />
    ) : (
        <Input
        type={type}
        id={id}
        name={name}
        value={value}
        classNameInput={classNameInput}
        onChange={onChange}
        onBlur={onBlur}
        />
        )}
    </div>
    );
}

export default GroupInputTable;
