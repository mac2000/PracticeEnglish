import React, {Component} from 'react'

export class Home extends Component {
    state = {
        skype: localStorage.getItem('skype') || '',
        age: localStorage.getItem('age') || '',
        gender: localStorage.getItem('gender') || '',
        country: localStorage.getItem('country') || '',
        topics: localStorage.getItem('topics') || ''
    }

    onChange = event => this.setState({[event.target.name]: event.target.value})

    onSubmit = event => {
        event.preventDefault()
        Object.keys(this.state).forEach(key => localStorage.setItem(key, this.state[key]))
        this.props.join(this.state)
    }

    render() {
        return <div>
            <h3>Home <small>{this.props.connected ? 'connected' : 'disconnected'}</small></h3>
            <form onSubmit={this.onSubmit}>
                <label htmlFor="skype">skype</label>
                <input id="skype" name="skype" type="text" value={this.state.skype} onChange={this.onChange} required />

                <label htmlFor="age">age</label>
                <input id="age" name="age" type="number" value={this.state.age} onChange={this.onChange} min="5" max="99" maxLength="2" required />

                <input type="radio" name="gender" id="male" value="M" onChange={this.onChange} checked={this.state.gender === 'M'} required/>
                <label htmlFor="male">male</label>
                <input type="radio" name="gender" id="female" value="F" onChange={this.onChange} checked={this.state.gender === 'F'} required/>
                <label htmlFor="female">female</label>

                <label htmlFor="country">country</label>
                <input id="country" name="country" type="text" value={this.state.country} onChange={this.onChange} required />

                <label htmlFor="topics">topics</label>
                <input id="topics" name="topics" type="text" value={this.state.topics} onChange={this.onChange} required />

                <input type="submit" value="Join" />
            </form>
        </div>
    }
}

export default Home