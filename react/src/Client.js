import React from 'react';
import io from "socket.io-client";
import Peer from "simple-peer";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone, faBars, faTimes, faLaptopHouse } from '@fortawesome/free-solid-svg-icons'

import style from './styles.module.css'

class Client extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			yourID: '',
			ID: {},
			users: {},
			stream: {},
			streaming: false,
			receivingCall: false,
			isCalling: true,
			caller: '',
			callerName: '',
			callerSignal: {},
			callAccepted: false,
			calling: true,
			isToggled: true,
			getUser: {
				email: this.props.email
			},
			name: '',
		};
		this.getCurrentUser = this.getCurrentUser.bind(this);
		this.toggleMenu = this.toggleMenu.bind(this);
	};

	userVideo = React.createRef();
	partnerVideo = React.createRef();
	socket = React.createRef();

  callPeer = (id) => {
	  const peer = new Peer({
		  initiator: true,
		  trickle: false,
		  objectMode: true,
		  config: {
			iceServers: [
				{
					urls: "stun:stun.l.google.com:19302", //STUN server se koristi da bi se dobila privatna adresa klijenta
					username: "edmir.h@gmail.com",
					credential: "98376683"
				},
				{
					url: 'turn:turn.bistri.com:80', //TURN server je u sustini relay, ako ne uspije UDP konekcija, prebacuje na TCP
    				credential: 'homeo',
    				username: 'homeo'
				}]
		  },
		  stream: this.state.stream, //stream je objekat u koji se smijesta media stream
	  });

	  peer.on("signal", data => {	//Kada peer koji poziva zeli poslati signalne podatke na suprotni peer
		  this.socket.current.emit("callUser", {userToCall: id, signalData: data, from: this.state.yourID, name: this.state.name });
	  });

	  peer.on("stream", stream => { //Peer primio video stream, koji treba prikazati u video tag
		if(this.partnerVideo.current) {
			this.partnerVideo.current.srcObject = stream;
		}
		else {
			this.partnerVideo.current.srcObject = null;
		}
	  });

	  peer.write('P2P Data Channel - ');

	this.socket.current.on("callAccepted", signal => {
		this.setState({
		  callAccepted: true
		});
		peer.signal(signal);//peer.signal ovaj metod se poziva svaki put kada suprotni klijent emitira peer.on("signal")
		//konkretno ovaj ovdje "signal" objekat ceka answer, tj kada se dogodi callAccepted, peer.signal ce poslati answer signal
		//u console.log se moze vidjeti da je ovo answer objekat
		//kada peer posalje answer, ponovo okine event iznad peer.on('signal') i emituje callUser event na socketIO
	});

  }

  acceptCall = () => {
	  this.setState({
		callAccepted: true,
		receivingCall: false,
		isCalling: false
	  });

	  const peer = new Peer({
		  initiator: false,
		  objectMode: true,
		  trickle: false,
		  stream: this.state.stream,
	  });
	  peer.on("signal", data => {//Kada peer koji poziva zeli poslati signalne podatke na suprotni peer
		  this.socket.current.emit("acceptCall", { signal: data, to: this.state.caller}) //data je answer signal
	  });

	  peer.on("stream", stream => {//Peer primio video stream, koji treba prikazati u video tag
		  if(this.partnerVideo.current) {
		  	this.partnerVideo.current.srcObject = stream;
		  }
		  else {
			  this.partnerVideo.current.srcObject = null;
		  }
	  });

	  peer.on("data", data => {
		  console.log('Data: ', data);
	  });

	  peer.signal(this.state.callerSignal);
	  //peer.signal ovaj metod se poziva svaki put kada suprotni klijent emitira peer.on("signal")
	  //konkretno ovaj ovdje "signal" objekat sadrzi signal od callera, tj peer s druge strane, 
	  //koristi se za razmjenu SDP tj za opis codeca koji su podrazni u browseru, i poslije toga za ICE servere,
	  //tj za uspostavljanje konekcije izmedju IP adresa iza NAT protokola.
	}

  	componentWillUpdate() {
		this.socket.current.on("allUsers", (users) => {
			this.setState({
				users: users
			});
		});
	}

	toggleMenu(e,tmp) {
		e.preventDefault();
		this.setState({
			isToggled: tmp
		})
	}

	componentDidMount() {
		this.socket.current = io.connect("/");
		this.getCurrentUser();
		navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
			if(this.userVideo.current) {
				this.userVideo.current.srcObject = stream;
			}
			else {
				this.userVideo.current.srcObject = null;
			}
			this.setState({
				stream: stream,
				streaming: true
			});
		})
		this.socket.current.on("yourID", (id) => {
			this.setState({
				yourID: id,
				ID: id
			}, () => console.log("Your id: ", this.state.yourID));
		});

		this.socket.current.on("allUsers", (users) => {
			this.setState({
				users: users
			});
		});

		this.socket.current.on("hey", (data) => {
			this.setState({
				caller: data.from,
				callerSignal: data.signal,
				callerName: data.name
			});
		})

	}

	getCurrentUser() {
		this.setState({submitting: true});
		fetch('/auth/users', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json'
		  },
		  body: JSON.stringify(this.state.getUser)
		})
		.then(res => res.json())
		.then(data => {
		  if(data.success) {
			this.socket.current.emit("getName", data.name)
			this.setState({
				name: data.name
			})
		  }
		  else {
			console.log(data.message);
		  }
		})
	  }

	render() {
		const mapa = Object.keys(this.state.users).map(key => {
			if(key === this.state.yourID) {
				return null;
			}
			return (
				<div style={{ marginTop: '10px' }}>
				<span style={{ fontWeight: 'bold' }}>{this.state.users[key]}</span> <button className={style.callButton} onClick={() => this.callPeer(key)}> <FontAwesomeIcon icon={faPhone} className={style.facall} transform={{ rotate: 90 }} color="green" size="lg" /> </button>
				</div>
			)
		});

		return (
			<div style={{ overflow: 'hidden' }}>
			<div className={style.header}><img src="logo.png" width="70" height="45" className={style.logo} /><button className={this.state.isToggled ? style.divOff : style.menuToggle} onClick={(e) => this.toggleMenu(e, true)}><FontAwesomeIcon icon={faBars} className={style.faMenu} color="black" size="sm" /></button></div>
				<div className={style.videoDiv}>
					<div className={style.videoCol}>
						<video className={style.partnerVideo} autoPlay unmuted ref={this.partnerVideo} width="800" height="700" />
					</div>
					<div className={style.partnerDiv}>
						<video className={style.userVideo} autoPlay muted ref={this.userVideo} width="400" height="300" />
					</div>
				</div>
				<div className={this.state.isToggled ? style.leftSidebar : style.leftSiderbarOff}>
					<button className={this.state.isToggled ? style.menuToggleOff : style.divOff} onClick={(e) => this.toggleMenu(e, false)}><FontAwesomeIcon icon={faTimes} className={style.faMenu} color="black" size="sm" /></button>
					<div className={this.state.isToggled ? style.calling : style.divOff}>
						<h3 className={this.state.isToggled ? '' : style.divOff}>Incoming calls:</h3>
						<p className={this.state.isCalling ? style.isCalling : style.divOff}>{this.state.callerName ? this.state.callerName + ' is calling you' : 'No incomning calls'}</p>
						{this.state.caller ? <button className={this.state.isCalling ? '' : style.divOff} onClick={(e) => this.acceptCall(e)}>Accept</button> : null}
					</div>
					<div className={this.state.isToggled ? style.info : style.divOff}>
						<h3 className={this.state.isToggled ? '' : style.divOff}>Available users:</h3>
						<span className={this.state.isToggled ? '' : style.divOff}>{mapa}</span>
					</div>
				</div>
				<div className={this.state.receivingCall ? style.callBox : style.divOff}>
					<img className={style.callerImg} src="user.png" width="102" height="110" />
					<p className={style.callerText}>{this.state.callerName ? this.state.callerName + ' is calling you' : null}</p>
					{this.state.caller ? <button className={style.callAccept} onClick={() => this.acceptCall()}><FontAwesomeIcon icon={faPhone} className={style.faBox} transform={{ rotate: 90 }} color="green" size="lg" /></button> : null}
				</div>
			</div>
		);
	}
}

export default Client
