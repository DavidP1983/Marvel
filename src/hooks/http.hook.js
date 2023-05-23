import { useState, useCallback } from "react";

export  const  useHttp = () => {
    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState(null);  // false or e.message

    const [process, setProcess] = useState('waiting'); // FSM

    const request = useCallback(async (url, method = "GET", body = null, headers = {'Content-type': 'aplication/json'}) => {
        setProcess('loading');
        // setLoading(true);  

        try {
            const response = await fetch(url, {method,body,headers});

            if(!response.ok) {
                throw new Error(`Could not fetch ${url}, status: ${response.status}`)
            }

            const data = await response.json();
            // setLoading(false);

            return data;
        }catch(e) {
            setProcess('error');
            // setLoading(false);
            // setError(e.message);
            throw e;
        }
       
    },[]);

    const clearError = useCallback(() => {
        setProcess('loading');
        // setError(false);
    },[]);

    return {process, request, clearError, setProcess};
   
}