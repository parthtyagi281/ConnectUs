import UserContext from "./UserContext"

export default function UserState(props){
    return (
        <UserContext.Provider value={{}}>
            {props.children}
        </UserContext.Provider>
    )
}