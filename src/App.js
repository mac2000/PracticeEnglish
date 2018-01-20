import React, { Component } from 'react'
import Home from './Home'
import List from './List'

export class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      connected: false,
      joined: false,
      user: null,
      users: []
    }
    this.connect()
  }

  connect() {
    this.socket = new WebSocket('wss://sock.azurewebsites.net')
    this.socket.onopen = () => this.setState({connected: true})
    this.socket.onmessage = event => this.onMessage(event)
    this.socket.onclose = () => {
      this.setState({connected: false})
      setTimeout(() => this.connect(), 5000)
    }

    if (this.timer) {
      clearInterval(this.timer)
    }
    this.timer = setInterval(() => {
      if (this.socket && this.state.joined) {
        this.socket.send(JSON.stringify({app: 'pe', action: 'ping', payload: this.state.user}))
      }
      const now = Date.now()
      this.setState({users: this.state.users.filter(u => now - u.lastSeen < 30000)})
    }, 5000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  join(user) {
    this.socket.send(JSON.stringify({app: 'pe', action: 'join', payload: user}))
    this.setState({joined: true, user: user})
  }

  leave() {
    this.socket.send(JSON.stringify({app: 'pe', action: 'leave', payload: this.state.user}))
    this.setState({joined: false})
  }

  onMessage(event) {
    const {data} = event
    let json = null

    try {
      json = JSON.parse(data)
    } catch(e) {
      console.log('unable parse', data)
    }

    const {app, action, payload} = json
    if (!app || !action || !payload || app !== 'pe') {
      return
    }
    switch(action) {
      case 'ping': return this.onPingOrJoin(payload)
      case 'join': return this.onPingOrJoin(payload)
      case 'leave': return this.onLeave(payload)
      default: return
    }
  }

  onPingOrJoin(user) {
    if (!user) return
    const {skype} = user
    if (!skype) return
    const found = this.state.users.find(i => i.skype === skype)
    const updated = found ? {...found, ...user, lastSeen: Date.now()} : {...user, lastSeen: Date.now()}
    const users = this.state.users.map(item => item.skype === skype ? updated : item)
    if (!found) {
      users.push(updated)
    }
    this.setState({users})
  }

  onLeave(user) {
    if (!user) return
    const {skype} = user
    if (!skype) return
    this.setState({users: this.state.users.filter(u => u.skype !== skype)})
  }

  render() {
    return this.state.joined ? <List users={this.state.users} user={this.state.user} leave={() => this.leave()} connected={this.state.connected} /> : <Home connected={this.state.connected} join={data => this.join(data)} />
  }
}

export default App
