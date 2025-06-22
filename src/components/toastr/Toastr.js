import React, { useEffect, useState } from 'react';
import './Toastr.css';

const Toastr = ({ message, duration = 3000 }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    if (!visible) return null;

    return (
        <div className="toastr">
            {message}
        </div>
    );
};

export default Toastr;