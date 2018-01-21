import React from 'react'
import User from './User'

const List = ({users, user, leave, connected}) => <div className="container">
    <div className="text-center mt-4 mb-4">
        <h3>List</h3>
        <p>{connected ? 'connected' : 'disconnected'}</p>
    </div>
    <div className="d-flex justify-content-center mt-4 mb-4">
        <div className="list">
            <ul className="list-group">
                {users.map(u => <li key={u.skype} className="list-group-item"><User {...u} me={u.skype === user.skype} /></li>)}
            </ul>
            <button onClick={leave} className="btn btn-primary btn-block mt-4">Leave</button>
        </div>
    </div>
</div>

export default List