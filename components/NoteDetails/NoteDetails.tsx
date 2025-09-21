'use client';
import type { Note } from "../../types/note";
import css from "./NoteDetails.module.css";

interface NoteDetailsProps {
  note: Note;
}

export default function NoteDetails({ note }: NoteDetailsProps) {
  return (
    <div className={css.container}>
      <h1 className={css.title}>{note.title}</h1>
      <p className={css.content}>{note.content}</p>
      {note.tag && <p className={css.tag}>Tag: {note.tag}</p>}
    </div>
  );
}
