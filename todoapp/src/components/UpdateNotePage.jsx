import React from 'react';
import { useParams } from 'react-router-dom';
import UpdateNoteForm from './UpdateNoteForm';

const UpdateNotePage = ({ BASE_URL }) => {
	const { id } = useParams(); // Get the "id" from the URL using useParams

	return (
		<div className="UpdateNotePage">
			<h1>Edit Note</h1>
			{/* Pass the "id" as noteId to the UpdateNoteForm */}
			<UpdateNoteForm BASE_URL={BASE_URL} noteId={id} />
		</div>
	);
};

export default UpdateNotePage;
