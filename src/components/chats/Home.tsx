import React, {useState, useEffect} from 'react';
// import firebase from '../../firebase';

import './Home.less';

import Chatbox from './Chatbox';

const Home = () => {
	const [message, setMessage] = useState("")
	const handleChange = e => {
		setMessage(e.target.value);
	}

	const handleSubmit = e => {
		e.preventDefault();
		// if(this.state.message !== ''){
		// 	const chatRef = firebase.database().ref('general');
		// 	const chat = {
		// 		message: this.state.message,
		// 		user: this.props.user.displayName,
		// 		timestamp: new Date().getTime()
		// 	}
			
		// 	chatRef.push(chat);
		// 	this.setState({message: ''});
		// }
	}
	return(
		<div className="home--container">
		<h1 >Demo chat!</h1>
		{/* {this.props.user && 
			
		} */}
		<div className="allow-chat">
				<form className="send-chat" onSubmit={handleSubmit}>
					<input type="text" name="message" id="message" value={message} onChange={handleChange} placeholder='Leave a message...' />
				</form>

				<Chatbox />
			</div>
		{/* {!this.props.user && 
			<div className="disallow-chat">
				<p><Link to="/login">Login</Link> or <Link to="/register">Register</Link> to start chatting!</p>
			</div>
		} */}
	</div>
	)
}
export default Home;