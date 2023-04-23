const SET_USER = 'SET_USER'
const LOGOUT = 'LOGOUT'

const defaultState = {
    isAuth: false,
    userId: undefined,
    name: '',
    icon: null
}

export default function userReducer(state = defaultState, action: any) {
    switch(action.type){
        case SET_USER:
            return {
                ...state,
                userId: action.payload.id,
                name: action.payload.name,
                icon: action.payload.icon,
                isAuth: true
            }
        case LOGOUT:
            localStorage.removeItem('token')
            return defaultState;
        default:
            return state
    }

}

export const setUser = (user: any) => ({type: SET_USER, payload: user})
export const logout = () => ({type: LOGOUT})