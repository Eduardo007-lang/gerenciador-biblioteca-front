// src/components/Message.js
import React from 'react';

const Message = ({ message, type }) => {
    if (!message) return null;

    const style = {
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '15px',
        fontWeight: 'bold',
        textAlign: 'center',
    };

    if (type === 'success') {
        style.backgroundColor = '#d4edda';
        style.color = '#155724';
        style.border = '1px solid #c3e6cb';
    } else if (type === 'error') {
        style.backgroundColor = '#f8d7da';
        style.color = '#721c24';
        style.border = '1px solid #f5c6cb';
    } 
    
    style.backgroundColor = '#e2e3e5';
    style.color = '#383d41';
    style.border = '1px solid #d6d8db';


    return (
        <div style={style}>
            {message}
        </div>
    );
};

export default Message;