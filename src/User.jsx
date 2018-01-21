import React from 'react'

export const User = ({skype, age, gender, country, topics, me}) => <div className="media">
    {me
        ? <img className="align-self-center mr-3" src={`https://api.skype.com/users/${skype}/profile/avatar`} width="48" height="48" alt={skype} />
        : <a href={`skype:${skype}?call`} className="align-self-center mr-3">
                <img src={`https://api.skype.com/users/${skype}/profile/avatar`} width="48" height="48" alt={skype} />
            </a>
    }

    <div className="media-body">
        <p className="m-0 text-muted">{country} &bull; {gender} &bull; {age}</p>
        <h4 className="m-0">
            {me ? skype : <a href={`skype:${skype}?call`}>{skype}</a>}
        </h4>
        <p className="m-0">{topics}</p>
    </div>
</div>

export default User