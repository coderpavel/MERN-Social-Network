import React from 'react'
import classnames from 'classnames'
import propTypes from 'prop-types';


const TextFieldGroup = ({
    name,
    placeholder,
    value,
    label,
    error,
    info,
    type,
    onChange,
    disabled
}) => {
    return (
        <div className="form-group">
            <input
                onChange={onChange}
                value={value}
                type={type}
                className={classnames('form-control form-control-lg', {
                    'is-invalid': error
                })}
                placeholder={placeholder}
                disaabled={disabled}
                name={name} />
            {info && <small className="form-text text-muted"></small>}
            {error && (<div className="invalid-feedback">{error}</div>)}
        </div>
    )
};

TextFieldGroup.propTypes = {
    name: propTypes.string.isRequired,
    placeholder: propTypes.string,
    value: propTypes.string.isRequired,
    label: propTypes.string,
    error: propTypes.string,
    info: propTypes.string,
    type: propTypes.string.isRequired,
    onChange: propTypes.func.isRequired,
    disabled: propTypes.string
}

TextFieldGroup.defaultProps = {
    type: 'text'
}

export default TextFieldGroup;