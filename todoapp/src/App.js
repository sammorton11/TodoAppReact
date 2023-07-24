import './App.css';
import {Component} from 'react';
import { Button, Grid, Textarea, Input, Card, Text, Row  } from "@nextui-org/react";

class App extends Component {
  constructor(props){
    super(props)
    this.state={
      descriptionError: "",
      notes:[]
    }
  }

  BASE_URL="http://localhost:5111/"

  componentDidMount() {
    this.refreshNotes();
  }

  clearInputFields() {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
  }
  
  handleDescriptionChange = (event) => {
    const descriptionValue = event.target.value;
    if (descriptionValue.length > 500) {
      this.setState({ descriptionError: true });
    } else {
      this.setState({ descriptionError: false });
    }
  }
  
  async refreshNotes() {
    fetch(this.BASE_URL + "api/TodoApp/GetNotes")
    .then(response=>response.json())
    .then(data=>{
      console.log(data);
      this.setState({notes:data});
    })
    .catch(error => {
      alert("Error getting notes:" + error);
    })
  } 

  async addNote() {
    var title = document.getElementById("title").value;
    var description = document.getElementById("description").value;
    const data = new FormData();

    data.append("title", title);
    data.append("description", description)

    fetch(this.BASE_URL + "api/TodoApp/AddNotes", {
      method: "POST",
      body: data
    })
    .then(res=>res.json())
    .then((result)=> {
      alert(result);
      this.refreshNotes();
      this.clearInputFields();
    })
    .catch(error => {
      alert("Error adding note to the database:", error)
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
      .catch(error => {
        alert("Error:" + error)
      })

  }
  async deletAllNotes() {
    fetch(this.BASE_URL + "api/TodoApp/DeleteAllNotes", {
      method: "DELETE"
    })
      .then(() => {
        alert("All notes deleted successfully");
        this.refreshNotes(); // Update the notes state directly after successful deletion
      })
      .catch(error => {
        alert("Error deleting notes: " + error);
      });
  }

  render() {
    const{notes} = this.state;
     
    return (
      <div className="App">

        <h2>Web Notes</h2>

        <div className="form-fields">
          <Input className='title-input' id="title" placeholder="Title" />
          
          <Textarea
            className='description-input'
            id="description"
            placeholder="Description"
            cols="50"
            rows="8" // Adjust the number of rows to set the height
            onChange={this.handleDescriptionChange} // Call the function when input changes
          />

          <div className='add-delete-all-container'>
            <Grid.Container gap={2}>
              <Grid>
                <Button color="success" auto onClick={() => this.addNote()}>Add</Button>
              </Grid>
              <Grid>
                <Button color="warning" auto onClick={() => this.deletAllNotes()}>Delete All</Button>
              </Grid>
            </Grid.Container>
          </div>
          {this.state.descriptionError && <p className="error">Description cannot exceed 500 characters.</p>}
        </div>


        <div className="note-list">
          {notes.map(note =>
            <div className="note-item-container" key={note.NoteId}>

              {/* <Grid.Container gap={3}>
                <Grid sm={2} md={12}>
                  <Card css={{ mw: "330px" }}>
                    <Card.Header>
                      <h3 className='note-title'>{note.Title}</h3>
                    </Card.Header>
                    <Card.Divider />
                    <Card.Body css={{ py: "$10" }}>
                      <Text>
                        {note.Description}
                      </Text>
                    </Card.Body>
                    <Card.Divider />
                    <Button color="warning" auto onClick={() => this.deleteNote(note.NoteId)}>Delete</Button>
                  </Card>
                </Grid>

              </Grid.Container> */}

              <Grid.Container gap={2}>
                <Grid >
                  <Card css={{ mw: "550px" }}>
                    <Card.Header>
                      <Text b>{note.Title}</Text>
                    </Card.Header>
                    <Card.Divider />
                    <Card.Body css={{ py: "$10" }}>
                      <p className='note-text'>{note.Description}</p>
                    </Card.Body>
                    <Card.Divider />
                    <Card.Footer>
                      <Row justify="flex-end" css={{marginRight: "25px"}}>
                        <Button size="sm" light>Edit</Button>
                        <Button size={"sm"} color="error" auto onClick={() => this.deleteNote(note.NoteId)}>Delete</Button> 
                      </Row>
                    </Card.Footer>
                  </Card>
                </Grid>
              </Grid.Container>

            </div>
          ).reverse()}
        </div>
      </div>
    );
  }
}

export default App;











