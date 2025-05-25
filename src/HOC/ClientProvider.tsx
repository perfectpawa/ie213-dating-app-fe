'use client';
import {Provider} from "react-redux";

import React, {useEffect} from 'react';
import {Persistor, persistStore} from 'redux-persist'
import {PersistGate} from 'redux-persist/integration/react'

import store from '../store/store';
import LoadingSpinner from '../components/LoadingSpinner';

const ClientProvider = ({ children }: { children: React.ReactNode }) => {

    const [persistor, setPersistor] = React.useState<Persistor | null>(null);

    useEffect(() => {
        const clientPersistor = persistStore(store);
        setPersistor(clientPersistor);
    }, [])

    if (!persistor) {
        return <LoadingSpinner />;
    }

    return <Provider store={store}>
        <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
            {children}
        </PersistGate>
    </Provider>
}

export default ClientProvider;