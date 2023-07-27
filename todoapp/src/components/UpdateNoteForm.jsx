import React, { useState, useEffect } from 'react';
import {Button, Textarea, Input, Row, Spacer, Grid, Loading} from '@nextui-org/react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const UpdateNoteForm = ({ noteId, BASE_URL }) => {
	const navigate = useNavigate();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');

	const [descriptionError, setDescriptionError] = useState(false);
	const [loading, setLoading] = useState(true);

	const handleDescriptionChange = (event) => {
		const descriptionValue = event.target.value;
		if (descriptionValue.length > 500) {
			setDescriptionError(true);
		} else {
			setDescriptionError(false);
			setDescription(descriptionValue);
		}
	};

	const navigateHome = () => {
		navigate('/');
	};

	const updateNote = () => {
		const data = new FormData();
		data.set('id', noteId);
		data.set('Title', title);
		data.set('Description', description);

		axios
			.put(`${BASE_URL}api/TodoApp/UpdateNote?id=${noteId}`, data)
			.then((response) => {
				console.log('Update response:', response.data);
				alert(response.data);
				navigateHome();
			})
			.catch((error) => {
				alert('Error updating note: ' + error);
			});
	};

	useEffect(() => {
		fetch(`${BASE_URL}api/TodoApp/GetNote?id=${noteId}`)
			.then((response) => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then((data) => {
				if (data && data.length > 0) {
					const note = data[0];
					setTitle(note.Title);
					setDescription(note.Description);
				}
				setLoading(false);
			})
			.catch((error) => {
				alert('Error fetching note data: ' + error);
				setLoading(false);
			});
	}, [noteId]);

	if (loading) {
		return <Loading size="lg" />;
	}

	return (
		<div className="form-fields">
			<Grid.Container css={{width: '750px'}} gap={2} justify="center">
				<Grid>
					<Input
						id="title"
						size="md"
						value={title}
						placeholder="Title"
						css={{
							width: '465px',
						}}
						onChange={(event) => setTitle(event.target.value)}
					/>
				</Grid>
				<Grid>
					<Textarea
						id="description"
						className="description-input"
						css={{ marginBottom: '15px' }}
						value={description}
						onChange={handleDescriptionChange}
						placeholder="Description"
						cols="50"
						rows="8"
					/>
				</Grid>
				<Grid>
					{descriptionError && (
						<p className="error">Description cannot exceed 500 characters.</p>
					)}
					<Row css={{ width: '415px' }} justify="flex-center">
						<Button color="primary" onPress={updateNote}>
							Update
						</Button>
						<Spacer css={{ marginTop: '15px' }} ></Spacer>
						<Button color="abort" onPress={navigateHome}>Cancel</Button>
					</Row>
				</Grid>
			</Grid.Container>
		</div>
	);
};

export default UpdateNoteForm;
