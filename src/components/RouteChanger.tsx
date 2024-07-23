import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jwt from 'jwt-decode'


function RouteChanger({token}: any) {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        let user: any;

        try{
            user = jwt(token);
        }catch(err){
            user = {role_name : ''}
        }

        if(!token && (['santri', 'guru', 'admin'].includes(location.pathname.split('/')[1] as never))){
			navigate('/')
            return
		}
        if(location.pathname.split('/')[1] != user.role_name && user.role_name){
            navigate(`/${user.role_name}`)
            return
        }

    },[token, location])

    return ( 
        <></>
     );
}

export default RouteChanger;