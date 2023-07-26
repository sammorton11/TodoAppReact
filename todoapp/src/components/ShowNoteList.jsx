import React, { useState, useEffect } from 'react';
import { Button, Grid, Textarea, Input, Card, Text, Row } from '@nextui-org/react';
import {useNavigate} from "react-router-dom";

const ShowNoteList = ({ BASE_URL }) => {
	const [notes, setNotes] = useState([]);
	const [descriptionError, setDescriptionError] = useState(false);
	const navigate = useNavigate();

	const handleEditNote = (note) => {
		console.log(note.NoteId);
		navigate(`/edit/${note.NoteId}`) // Ensure that 'note' object is passed to the 'UpdateNoteForm' component
	};

	useEffect(() => {
		refreshNotes();
	}, []);

	const clearInputFields = () => {
		document.getElementById('title').value = '';
		document.getElementById('description').value = '';
	};

	const handleDescriptionChange = (event) => {
		const descriptionValue = event.target.value;
		if (descriptionValue.length > 500) {
			setDescriptionError(true);
		} else {
			setDescriptionError(false);
		}
	};

	const refreshNotes = () => {
		fetch(BASE_URL + 'api/TodoApp/GetNotes')
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				setNotes(data);
			})
			.catch((error) => {
				alert('Error getting notes:' + error);
			});
	};

	const addNote = () => {
		var title = document.getElementById('title').value;
		var description = document.getElementById('description').value;
		const data = new FormData();

		data.append('title', title);
		data.append('description', description);

		fetch(BASE_URL + 'api/TodoApp/AddNotes', {
			method: 'POST',
			body: data,
		})
			.then((res) => res.json())
			.then((result) => {
				alert(result);
				refreshNotes();
				clearInputFields();
			})
			.catch((error) => {
				alert(error);
			});
	};

	const deleteNote = (id) => {
		fetch(BASE_URL + 'api/TodoApp/DeleteNotes?id=' + id, {
			method: 'DELETE',
		})
			.then((res) => res.json())
			.then((result) => {
				alert(result);
				refreshNotes();
			})
			.catch((error) => {
				alert('Error:' + error);
			});
	};

	const deletAllNotes = () => {
		fetch(BASE_URL + 'api/TodoApp/DeleteAllNotes', {
			method: 'DELETE',
		})
			.then(() => {
				alert('All notes deleted successfully');
				refreshNotes();
			})
			.catch((error) => {
				alert('Error deleting notes: ' + error);
			});
	};

	return (
		<div className="ShowNoteList">
			<h2>Web Notes</h2>
			<div className="form-fields">
				<Input
					id="title"
					size="lg"
					placeholder="Title"
					css={{
						marginBottom: '25px',
						width: '465px',
					}}
				/>
				<Textarea
					className="description-input"
					id="description"
					placeholder="Description"
					cols="50"
					rows="8"
					onChange={handleDescriptionChange}
				/>
				<div className="add-delete-all-container">
					<Row css={{ width: '465px' }} justify="flex-end">
						<Button css={{ marginRight: '15px' }} color="success" auto onClick={addNote}>
							Add
						</Button>
						<Button color="warning" auto onClick={deletAllNotes}>
							Delete All
						</Button>
					</Row>
				</div>
				{descriptionError && <p className="error">Description cannot exceed 500 characters.</p>}
			</div>

			<div className="note-list">
				{notes.map((note) => (
					<div className="note-item-container" key={note.NoteId}>
						<Grid.Container gap={2}>
							<Grid>
								<Card css={{ mw: '550px' }}>
									<Card.Header>
										<Text b>{note.Title}</Text>
									</Card.Header>
									<Card.Divider />
									<Card.Body css={{ py: '$10' }}>
										<p className="note-text">{note.Description}</p>
									</Card.Body>
									<Card.Divider />
									<Card.Footer>
										<Row justify="flex-end" css={{ marginRight: '25px' }}>
											<Button size="sm" light onClick={() => handleEditNote(note)}>
												Edit
											</Button>
											<Button size="sm" color="error" auto onClick={() => deleteNote(note.NoteId)}>
												Delete
											</Button>
										</Row>
									</Card.Footer>
								</Card>
							</Grid>
						</Grid.Container>
					</div>
				))}
			</div>
		</div>
	);
};

export default ShowNoteList;
