import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import * as AppRoutes from './routes';

export const App = () => {
    return (
        <BrowserRouter>
            <Routes>                              
                <Route path="/home" element={<p>Test One </p>}>
                    <Route path="/" element={(<p>Test Two!</p>)} />                    
                </Route>                
                <Route path="*" element={<Navigate to="/home" /> } />
            </Routes>
        </BrowserRouter>
    )
}