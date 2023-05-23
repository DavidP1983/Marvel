import {createContext} from 'react';

const dataCotext = createContext({
    name: '',
    getComponentName: () => {},
})

export default dataCotext;