import React, {Component} from 'react'
import countries from './countries'
const genders = ['male', 'female']

export class Home extends Component {
    state = {
        skype: localStorage.getItem('skype') || '',
        age: localStorage.getItem('age') || '',
        gender: localStorage.getItem('gender') || '',
        country: localStorage.getItem('country') || '',
        topics: localStorage.getItem('topics') || ''
    }

    onChange = event => {
        if (event.target.name === 'country') {
            this.countryInput.setCustomValidity(countries.indexOf(event.target.value) === -1 ? 'Unknown country' : '')
        }
        else if (event.target.name === 'gender') {
            this.genderInput.setCustomValidity(genders.indexOf(event.target.value) === -1 ? 'Should be "male" or "female"' : '')
        }
        this.setState({[event.target.name]: event.target.value})
    }

    onSubmit = event => {
        event.preventDefault()
        Object.keys(this.state).forEach(key => localStorage.setItem(key, this.state[key]))
        this.props.join(this.state)
    }

    render() {
        return <div className="container">
            <div className="text-center mt-4 mb-4">
                <h3>Home</h3>
                <p>{this.props.connected ? 'connected' : 'disconnected'}</p>
            </div>
            <div className="d-flex justify-content-center">
                <form onSubmit={this.onSubmit} className="form-signin">
                    <div className="form-group">
                        <input id="skype" name="skype" placeholder="skype" className="form-control" type="text" value={this.state.skype} onChange={this.onChange} required />
                        <label htmlFor="skype">skype</label>
                    </div>
                    <div className="form-group">
                        <input id="age" name="age" placeholder="age" className="form-control" type="number" value={this.state.age} onChange={this.onChange} min="5" max="99" maxLength="2" required />
                        <label htmlFor="age">age</label>
                    </div>
                    <div className="form-group">
                        <input list="genders" id="gender" name="gender" type="text" placeholder="gender" className="form-control" value={this.state.gender} onChange={this.onChange} ref={input => this.genderInput = input} autoComplete="off" required />
                        <label htmlFor="gender">gender</label>
                        <datalist id="genders">
                            {genders.map(gender => <option key={gender} value={gender} />)}
                        </datalist>
                    </div>
                    <div className="form-group">
                        <input list="countries" id="country" name="country" type="text" placeholder="country" className="form-control" value={this.state.country} onChange={this.onChange} ref={input => this.countryInput = input} autoComplete="off" required />
                        <label htmlFor="country">country</label>
                        <datalist id="countries">
                            {countries.map(country => <option key={country} value={country} />)}
                        </datalist>
                    </div>
                    <div className="form-group">
                        <input id="topics" name="topics" type="text" placeholder="country" className="form-control" value={this.state.topics} onChange={this.onChange} maxLength="100" required />
                        <label htmlFor="topics">topics</label>
                    </div>
                    <input type="submit" value="Join" className="btn btn-primary btn-block" />
                </form>
            </div>

        </div>
    }
}

export default Home