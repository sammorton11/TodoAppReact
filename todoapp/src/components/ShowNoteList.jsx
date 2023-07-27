import React, { useState, useEffect } from 'react';
import { Button, Grid, Textarea, Input, Card, Text, Row, Loading } from '@nextui-org/react';
import {useNavigate} from "react-router-dom";

const ShowNoteList = ({ BASE_URL }) => {
	const [notes, setNotes] = useState([]);
	const [descriptionError, setDescriptionError] = useState(false);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		refreshNotes();
	});

	const handleEditNote = (note) => {
		navigate(`/edit/${note.NoteId}`)
	};

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
				setLoading(false);
			})
			.catch((error) => {
				alert('Error getting notes:' + error);
			});
	};

	const addNote = () => {
		const title = document.getElementById('title').value;
		const description = document.getElementById('description').value;
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
			.then((response) => {
				alert(response)
				refreshNotes();
			})
			.catch((error) => {
				alert('Error:' + error);
			});
	};

	const deleteAllNotes = () => {

		fetch(BASE_URL + 'api/TodoApp/DeleteAllNotes', {
			method: 'DELETE',
		})
			.then(() => {
				refreshNotes();
			})
			.catch((error) => {
				alert('Error deleting notes: ' + error);
			});
	};

	if (loading) {
		return <p>Loading Please Wait...</p>;
	}

	return (
		<div className="ShowNoteList">
			<h2>Web Notes</h2>
			<div className="form-fields">
				<Input
					id="title"
					size="md"
					placeholder="Title"
					css={{
						marginBottom: '25px',
						minWidth: '400px',
					}}
				/>
				{/*<div id="confirmationDialog" className="hidden">*/}
				{/*	<p>Are you sure you want to delete all notes?</p>*/}
				{/*	<Button onClick={deleteAllNotes()}>OK</Button>*/}
				{/*	<Button onClick={hideConfirmationDialog()}>Cancel</Button>*/}
				{/*</div>*/}
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
						<div className="add-button">
							<Button css={{ marginRight: '15px' }} color="success" auto onPress={addNote}>
								Add
							</Button>
						</div>
						<div className="delete-all-button">
							<Button color="warning" auto onPress={deleteAllNotes}>
								Delete All
							</Button>
						</div>
					</Row>
				</div>
				{descriptionError && <p className="error">Description cannot exceed 500 characters.</p>}
			</div>


			<div className="note-list">
				{loading ? (
					<Loading size="lg" />
				) : (
					<ul>
						{notes.map((note) => (
							<div className="note-item-container" key={note.NoteId}>
								<Grid.Container gap={2}>
									<Grid>
										<Card css={{
											maxWidth: "550px",
											minWidth: "350px"
										}}>
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
													<div className="edit-button">
														<Button
															size="sm"
															light
															onPress={() => handleEditNote(note)}>
															Edit
														</Button>
													</div>
													<div className="delete-button">
														<Button
															size="sm"
															color="error"
															auto
															onPress={() => deleteNote(note.NoteId)}>
															Delete
														</Button>
													</div>
												</Row>
											</Card.Footer>
										</Card>
									</Grid>
								</Grid.Container>
							</div>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default ShowNoteList;
