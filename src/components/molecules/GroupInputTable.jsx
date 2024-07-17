import Label from "../atoms/Label";
import Input from "../atoms/Input";

function GroupInputTable({ htmlFor, classNameLabel,txt,type, id, name, value, onChange, onBlur, classNameInput}) {
    return (     
    <div className="form-group mb-4">
        <Label 
        htmlFor={htmlFor}
        classNameLabel={classNameLabel}
        txt={txt} 
        />
        <Input
        type={type}
        id={id}
        name={name}
        classNameInput={classNameInput}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        />
    </div>
    );
}

export default GroupInputTable;