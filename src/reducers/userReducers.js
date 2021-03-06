import firebase from 'firebase';

const GET_REALTIME_USERS_REQUEST= 'GET_REALTIME_USERS_REQUEST',
GET_REALTIME_USERS_SUCCESS='GET_REALTIME_USERS_SUCCESS',
GET_REALTIME_MESSAGES='GET_REALTIME_MESSAGES',
GET_REALTIME_MESSAGES_FAILURE='GET_REALTIME_MESSAGES_FAILURE';

const intiState = {
    users: [],
    conversations: []
}

const userReducers= (state = intiState, action) => {

    switch(action.type){
        case GET_REALTIME_USERS_REQUEST:
           return state;
        case GET_REALTIME_USERS_SUCCESS:
            return {
                ...state,
                users: action.payload.users
            }
        case GET_REALTIME_MESSAGES:
            return {
                ...state,
                conversations: action.payload.conversations
            }
        case GET_REALTIME_MESSAGES_FAILURE:
            return {
                ...state,
                conversations: []
            }
        default: return state;
        
    }
        

   

}

export const getRealtimeUsers = (uid) => {
    return async (dispatch) => {
        dispatch({ type: GET_REALTIME_USERS_REQUEST });
        console.log('get realtime users request')
        const db = firebase.firestore()
        const unsubscribe = db.collection("users")
        .onSnapshot((querySnapshot) => {
            const users = [];
            querySnapshot.forEach(function(doc) {
                if(doc.data().uid !==uid){   
                     users.push(doc.data());
                }
            });
            //console.log(users);
            dispatch({ 
                type: GET_REALTIME_USERS_SUCCESS,
                payload: { users }
            });

            console.log('get realtime users success')
        });
        return unsubscribe;
    }
    }
export const updateMessage = (msgObj) => {
    return async dispatch => {
        const db = firebase.firestore();
        db.collection('conversations')
        .add({
            ...msgObj,
            isView: false,
            createdAt: new Date()
        })
        .then((data) => {
            // console.log(data)
            //success
        })
        .catch(error => {
            console.log(error)
        });

    }
}
export const getRealtimeConversations = (user) => {
    return async dispatch => {

        const db = firebase.firestore();
        db.collection('conversations')
        .where('user_uid_1', 'in', [user.uid_1, user.uid_2])
        .orderBy('createdAt', 'asc')
        .onSnapshot((querySnapshot) => {

            const conversations = [];

            querySnapshot.forEach(doc => {

                if(
                    (doc.data().user_uid_1 === user.uid_1 && doc.data().user_uid_2 === user.uid_2)
                    || 
                    (doc.data().user_uid_1 === user.uid_2 && doc.data().user_uid_2 === user.uid_1)
                ){
                    conversations.push(doc.data())
                }

                if(conversations.length > 0){
                    dispatch({
                        type: GET_REALTIME_MESSAGES,
                        payload: { conversations }
                    })
                    
        console.log('get realtime messages success')
                }else{
                    dispatch({
                        type:GET_REALTIME_MESSAGES_FAILURE,
                        payload: { conversations }
                    })
                    
        console.log('get realtime messages failulre')
                } 
            });
        })
    }
}

export default userReducers