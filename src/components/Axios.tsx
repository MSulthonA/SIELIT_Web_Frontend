/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios from 'axios';

class CustomAxios {
    axiosWithInterceptor: any;
    constructor(setToken: React.Dispatch<React.SetStateAction<string>>) {
        this.axiosWithInterceptor = Axios.create().interceptors.response.use(
            response => {
                return response
            },
            function (error) {
                if (error.response.status === 401) {
                    localStorage.setItem('token', '');
                    setToken('');
                }
            }
        );
    }

    create() {
        return this.axiosWithInterceptor;
    }
}

export default CustomAxios;