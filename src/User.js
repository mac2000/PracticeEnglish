import React from 'react'

export const User = ({skype, age, gender, country, topics, me}) => <div>
    <p>{me ? 'me' : null} {skype} {age} {gender} {country} {topics}</p>
</div>

export default User