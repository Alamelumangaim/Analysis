import React from 'react';

const SideMenu = ({ machineNames }) => {
    return (
        <div className="side-menu">
            <ul>
                {machineNames.map((machine, index) => (
                    <li key={index}>{machine}</li>
                ))}
            </ul>
        </div>
    );
}

export default SideMenu;
