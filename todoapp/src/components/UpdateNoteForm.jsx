import React, { useState, useEffect } from 'react';
import { Button, Textarea, Input } from '@nextui-org/react';
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
				navigate('/');
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
					const note = data[0]; // Assuming only one note is returned
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
		return <p>Loading note data...</p>;
	}

	return (
		<div className="UpdateNoteForm">
			<div>
				<Input
					id="title"
					value={title}
					onChange={(event) => setTitle(event.target.value)}
					size="lg"
					placeholder="Title"
					css={{ marginBottom: '25px' }}
				/>
				<Textarea
					id="description"
					className="description-input"
					value={description}
					onChange={handleDescriptionChange}
					placeholder="Description"
					cols="50"
					rows="8"
				/>
				{descriptionError && (
					<p className="error">Description cannot exceed 500 characters.</p>
				)}
				<Button color="abort">Cancel</Button>
				<Button color="primary" onPress={updateNote}>
					Update
				</Button>
			</div>
		</div>
	);
};

export default UpdateNoteForm;
