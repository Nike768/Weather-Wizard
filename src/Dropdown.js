import * as React from 'react';

const Dropdown = ({ Cities, value, onChange }) => {

    return (

        <div>
            
            <select

                value={value}
                onChange={onChange}
            >
                {Cities.map((cities, index) => (
                    <option value={cities.name}>{cities.name}</option>
                ))}

            </select>
        </div>
    )
};
export default Dropdown;