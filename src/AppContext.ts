import { createContext } from 'react';

interface AppContext {
    token: {
        data: string
        set: React.Dispatch<React.SetStateAction<string>>
    }

    loading: {
        data: boolean
        set: React.Dispatch<React.SetStateAction<boolean>>
    }
}

const defaultAppState = {
    token: { data: '', set: () => { } },
    loading: { data: false, set: () => { } }
}



export const AppContext = createContext<AppContext>(defaultAppState);