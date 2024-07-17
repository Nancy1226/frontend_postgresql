function Label({ txt, htmlFor, classNameLabel }) {
    return (
        <label htmlFor={htmlFor} className={classNameLabel}>
            {txt}
        </label>
    );
}

export default Label;