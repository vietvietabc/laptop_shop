import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-dark text-white text-center py-3 mt-auto">
            <div>Laptop Shop &copy; {new Date().getFullYear()}</div>
        </footer>
    );
}
