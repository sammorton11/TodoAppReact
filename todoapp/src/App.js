import './App.css';
import {Component} from 'react';

class App extends Component {
  constructor(props){
    super(props)
    this.state={
      notes:[]
    }
  }

  BASE_URL="http://localhost:5111/"

  componentDidMount() {
    this.refreshNotes();
  }

  async refreshNotes(){
    fetch(this.BASE_URL + "api/TodoApp/GetNotes")
    .then(response=>response.json())
    .then(data=>{
      this.setState({notes:data});
    })
  } 

  async addNote() {
    var newNotes = document.getElementById("newNotes").value;
    const data = new FormData();
    data.append("newNotes", newNotes);

    fetch(this.BASE_URL + "api/TodoApp/AddNotes", {
      method: "POST",
      body: data
    })
    .then(res=>res.json())
    .then((result)=> {
      alert(result);
      this.refreshNotes();
    })
  }

  async deleteNote(id) {
    fetch(this.BASE_URL + "api/TodoApp/DeleteNotes?id="+id, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then((result) => {
        alert(result);
        this.refreshNotes();
      })
  }

  render() {
    const{notes} = this.state;
     
    return (
        <div className="App">
          <h2>C# Dotnet Todo App</h2>
          <input id="newNotes"/>&nbsp;
          <button onClick={()=> this.addNote()}>Add Note</button>
          {notes.map(note=>
            <p>
              <b>{note.description}</b>&nbsp;
              <button onClick={() => this.deleteNote(note.id)}>Delete Note</button>
            </p>
          )}
        </div>
      )
  }
}

export default App;
