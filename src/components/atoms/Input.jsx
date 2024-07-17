function Input({ type, id, name, dato, onChange, onBlur, classNameInput}) {
    return ( 
        <input
        type={type}
        id={id}
        name={name}
        className={classNameInput}
        value={dato}
        onChange={onChange}
        onBlur={onBlur}
        required
        />
     );
}

export default Input;