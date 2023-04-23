const SET_CHAT = 'SET_CHAT'
const ALL_CHAT = 'ALL_CHAT'
const SET_MEMBERS = 'SET_MEMBERS'
const SET_MESSAGES = 'SET_MESSAGES'
const RESETALL = 'RESETALL'
const RESET = 'RESET'
const DEL_CHAT_LIST = 'DEL_CHAT_LIST'
const SET_BANED = 'SET_BANED'

const defaultState = {
    chatId: '',
    name: '',
    private: false,
    list: [],
    members: [],
    messages: [],
    admins: undefined,
    moderators: [],
    ban: [],
    public: false,
    icon: null
}

export default function chatReducer(state = defaultState, action: any) {
    switch(action.type){
        case SET_CHAT:
            return {
                ...state,
                chatId: action.payload[0].id,
                name: action.payload[0].name,
                private: action.payload[0].private,
                admins: action.payload[0].admins,
                moderators: action.payload[0].moderators,
                public: action.payload[0].public,
                icon: action.payload[0].icon
            }
        case ALL_CHAT:
            return{
                ...state,
                list: action.payload
            }
        case SET_MEMBERS:
            return{
                ...state,
                members: action.payload
            }
        case SET_BANED:
            return{
                ...state,
                ban: action.payload,
            }
        case RESET:
            return{
                ...state,
                chatId: '',
                name: '',
                members: [],
                private: false
            }
        case DEL_CHAT_LIST:
            return{
                ...state,
                list: [...state.list.filter((item: any)=>item.id != action.payload)]
            }
        case SET_MESSAGES:
            return{
                ...state,
                messages: action.payload
            }
        case RESETALL:
            return defaultState;
        default:
            return state
    }

}

export const setChat = (chat: any) => ({type: SET_CHAT, payload: chat})
export const setMembers = (chat: any) => ({type: SET_MEMBERS, payload: chat})
export const setBaned = (chat: any) => ({type: SET_BANED, payload: chat})
export const allChat = (chat: any) => ({type: ALL_CHAT, payload: chat})
export const setMessages = (chat: any) => ({type: SET_MESSAGES, payload: chat})
export const deleteChatFromList = (chat: any) => ({type: DEL_CHAT_LIST, payload: chat})
export const reset = () => ({type: RESET})
export const resetAll = () => ({type: RESETALL})