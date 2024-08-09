import { ADMIN_LOGIN_START , ADMIN_LOGIN_SUCCESS , ADMIN_LOGIN_FAILED , ADMIN_LOGOUT} from "./actions"
import { initialState } from "./appContext"


const reducer = (state , action) => {
    if(action.type === ADMIN_LOGIN_START){
        return{
            ...state,
            isLoading : true
        }
    }
    if(action.type === ADMIN_LOGIN_SUCCESS){
        return{
            ...state ,
            user : action.payload.user ,
            token : action.payload.token ,
            isLoading : false
        }
    }
    if(action.type === ADMIN_LOGIN_FAILED){
        return{
            ...state ,
            isLoading : false ,
            error : action.payload.msg
        }
    }
    if(action.type === ADMIN_LOGOUT){
        return initialState
    }
}


export default reducer