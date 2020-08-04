import React, { useState, useRef } from 'react';
import io from "socket.io-client";
import Peer from "simple-peer";

import AppBar from '@material-ui/core/AppBar';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import color from '@material-ui/core/colors/blueGrey';

import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';

import style from './styles.module.css'

const styles = {
  root: {
    padding: '3px',
    display: 'flex',
    flexWrap: 'wrap',
    margin: '10px 10px 5px 10px',
    justifyContent: 'space-around',
  },
  gridList: {
    width: '100%',
    overflowY: 'auto',
    marginBottom: '24px',
  },
  gridTile: {
    backgroundColor: '#fcfcfc',
  },
  appBar: {
    backgroundColor: '#333',
  }
};

class Client extends React.Component {
	constructor(props) {
		super(props);
	}
	state = {
		yourID: '',
		users: [],
		stream: this.state,
		streaming: false,
		receivingCall: false,
		caller: '',
		callerSignal: this.state,
		callAccepted: false
	};

	userVideo = React.createRef();
	partnerVideo = React.createRef();
	socket = React.createRef();

  callPeer = (id) => {
	  const peer = new Peer({
		  initiator: true,
		  trickle: false,
		  config: {

			iceServers: [
				{
					urls: "stun:stun.l.google.com:19302",
					username: "edmir.h@gmail.com",
					credential: "98376683"
				},
				{
					urls: "turn:104.197.150.30?transport=udp",
					username: "edmir.h@gmail.com",
					credential: "98376683"
				},
				{
					urls: "turn:104.197.150.30?transport=tcp",
					username: "edmir.h@gmail.com",
					credential: "98376683"
				}
			]
		  }
	  });

	  peer.on("signal", data => {
		  this.socket.current.emit("callUser", {userToCall: id, signalData: data, from: this.state.yourID });
	  });

	  peer.on("stream", stream => {
		this.partnerVideo.current.srcObject = stream;
	  });

	  this.socket.current.on("callAccepted", signal => {
		  this.setState({
			  callAccepted: true
			}, () => {
				peer.signal(signal);
			});
	  });
  }

  acceptCall = () => {
	  this.setState({
		  callAccepted: true
		}, () => {console.log("[REACT]CallAccepted true!")});

	  const peer = new Peer({
		  initiator: false,
		  trickle: false,
		  stream: this.state.stream,
	  });
	  peer.on("signal", data => {
		  this.socket.current.emit("acceptCall", { signal: data, to: this.state.caller })
	  });

	  peer.on("stream", stream => {
		  this.partnerVideo.current.srcObject = stream;
	  });

	  peer.signal(this.state.callerSignal);
  }

	componentDidMount() {
		this.socket.current = io.connect("/");
		navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
			window.stream = stream;
			this.userVideo.current.srcObject = stream;
			this.setState({
				stream: stream,
				streaming: true
			}, () => {console.log("[REACT]Streaming true!")});
		})

		this.socket.current.on("yourID", (id) => {
			this.setState({
				yourID: id
			});
		});

		this.socket.current.on("allUsers", (users) => {
			this.setState({
				users: [...users, users]
			});
		} )

		this.socket.current.on("hey", (data) => {
			this.setState({
				receivingCall: true
			});
			this.setState({
				caller: data.from
			});
			this.setState({
				callerSignal: data.signal
			});
		})
	}


	render() {
		console.log("Users: ", this.users);
		return (
			<>
				<div className={style.videoDiv}>
					<div className={style.videoCol}>
						<video autoPlay muted ref={this.userVideo} width="600" height="500" />
						</div>
						<div className={style.videoCol}>
							<video autoPlay muted ref={this.partnerVideo} width="600" height="500" />
							<h1>{this.state.caller} is calling you</h1>
							<button onClick={() => this.acceptCall()}>Accept</button>
						</div>
					<div clasName={style.videoDiv}>
						{Object.keys(this.state.users).map(key => {
							if(key === this.state.yourID) {
								return null;
							}
							return (
								<button onClick={() => this.callPeer(key)}>Call {key}</button>
							)
						})}
					</div>
				</div>
			</>
		);
	}
}

export default Client
