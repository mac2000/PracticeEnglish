import React from 'react'
import User from './User'

const List = ({users, user, leave, connected}) => <div>
    <h3>List <small>{connected ? 'connected' : 'disconnected'}</small></h3>
    {users.map(u => <User key={u.skype} {...u} me={u.skype === user.skype} />)}
    <button onClick={leave}>leave</button>
</div>

export default List