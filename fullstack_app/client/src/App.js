import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class App extends Component {
	// initialize our state
	state = {
			data: [],
			id: 0,
			message: null,
			intervalIsSet: false,
			idToDelete: null,
			idToUpdate: null,
			objectToUpdate: null,
		};

		// when the component mounts, first thing it does is fetch all existing data in our db
		// then we incorporate a polling logic so that we can easily see if our db has
		// changed and implement those changes into UI
	componentDidMount(){
		this.getDataFromDb();
		if (!this.state.intervalIsSet){
			let interval = setInterval(this.getDataFromDb, 1000);
			this.setState({ intervalIsSet: interval});
			}
		}

	// never let a process live forever
	// always kill a process everytime we are done using it
	
	componentWillUnmount(){
		if (this.state.intervalIsSet){
			clearInterval(this.state.intervalIsSet);
			this.setState({ intervalIsSet: null});
		}
	}

	// just a note, here, in the front end we would use the id key of our data object
	// in order to identify which we want to update or delete
	//for our back end, we use the object id assigned by mongodb to modify
	// database entries
	
	// our first get method that uses our backen api 
	// to fetch data from our database
	getDataFromDb = () => {
		fetch('http://localhost:3001/api/getData')
			.then((data) => data.json())
			.then((res) => this.setState({data: res.data}));
	};
	
	// our put method uses our backend api
	// to create new query info in our database
	putDataToDb = (message) => {
		let currentIds = this.state.data.map(data => data.id);
		let idToBeAdded = 0;
		while (currentIds.includes(idToBeAdded)){
			idToBeAdded += 1;
		}

		axios.post('http://localhost:3001/api/putData', {
			id: idToBeAdded,
			message: message,
		});
	};

	// delete method that uses backend api
	// to remove existing database info
	deleteFromDb = idToDelete => {
    window.alert(`id to delete is ${idToDelete}`);
    parseInt(idToDelete);
		let objIdToDelete = null;
		this.state.data.forEach(data => {
      window.alert(data.id);
			if (data.id === idToDelete) {
				objIdToDelete = data._id;
        window.alert("found");
			}	
		});

		axios.delete('http://localhost:3001/api/deleteData', {
			data: {
				id: objIdToDelete	
			},	
		});
	};

	// our update method that uses our backend api
	// to overwrite existing database information
	updateDb = (idToUpdate, updateToApply) => {
		let objIdToUpdate = null;
		this.state.data.forEach((data) => {
			if (data.id === idToUpdate){
				objIdToUpdate = data._id;
			}
		});
		
		axios.post('http://localhost:3001/api/updateData', {
			id: objIdToUpdate,
			update: {message: updateToApply},
		});
	};

	render() {
		const {data} = this.state;
    return (
			<div>
				<ul>
					{data.length <= 0 ? 'NO DB ENTRIES yeT' : data.map(data => (
							<li style={{ padding: '10px'}} key={data}>
								<span style={{color: 'gray'}}> id: </span> {data.id } <br />
								<span style={{color: 'gray'}}> data: </span> {data.message}
							</li>
						))}
				</ul>
				<div>
					<input
						type="text"
						onChange={(e) => this.setState({message: e.target.value})}
						placeholder="add something in the database"
						style={{width: '200px'}}
					/>
					<button onClick={() => this.putDataToDb(this.state.message)}>
						Add
					</button>
				</div>
        <div>
          <input 
            type="text"
            onChange={ (e) => this.setState({idToDelete: e.target.value})}
            placeholder="put id of item to delete here"
          />
          <button onClick={() => this.deleteFromDb(this.state.idToDelete)}>
            Delete 
          </button>
        </div>
        <div>
          <input 
            type="text"
            onChange={(e) => this.setState({idToUpdate: e.target.value})}
            placeholder="put id of item to update here"
          />
          <input 
            type="text"
            onChange={(e) => this.setState({updateToApply: e.target.value})}
            placeholder="put new value of item item to update here"
          />
          <button onClick={() => this.updateDb(this.state.idToUpdate)}>
            Update 
          </button>
        </div>



			</div>    
    );
  }
}

export default App;
