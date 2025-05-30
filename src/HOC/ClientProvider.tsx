'use client';
import {Provider} from "react-redux";

import React, {useEffect} from 'react';
import {Persistor, persistStore} from 'redux-persist'
import {PersistGate} from 'redux-persist/integration/react'

import store from '../store/store';
import LoadingSpinner from '../components/LoadingSpinner';
import { NotificationProvider } from "../contexts/NotificationContext";
import { ModalProvider } from "@/contexts/ModalContext";
import { AuthProvider } from "../contexts/AuthContext";

const ClientProvider = ({ children }: { children: React.ReactNode }) => {

    const [persistor, setPersistor] = React.useState<Persistor | null>(null);

    useEffect(() => {
        console.time('Redux Persist Initialization');
        const clientPersistor = persistStore(store);
        setPersistor(clientPersistor);
        console.timeEnd('Redux Persist Initialization');
    }, [])

    if (!persistor) {
        return <LoadingSpinner />;
    }
    
    return <Provider store={store}>
        <PersistGate 
            loading={<LoadingSpinner />} 
            persistor={persistor}
            onBeforeLift={() => {
                console.time('Redux Persist Rehydration');
                console.log('Starting Redux Persist rehydration...');
            }}
        >
            {() => {
                console.timeEnd('Redux Persist Rehydration');
                console.log('Redux Persist rehydration complete');
                return (
                    <AuthProvider>
                        <ModalProvider>
                            <NotificationProvider>
                                {children}
                            </NotificationProvider>
                        </ModalProvider>
                    </AuthProvider>
                );
            }}
        </PersistGate>
    </Provider>
}

export default ClientProvider;