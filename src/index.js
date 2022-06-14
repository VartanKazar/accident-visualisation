import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DataHandlerProvider } from './helpers/DataHandler';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <DataHandlerProvider>
        <App/>
    </DataHandlerProvider>
);
