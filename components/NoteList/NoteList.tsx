'use client';
import css from "./NoteList.module.css";
import type { Note } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../lib/api";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { mutate: deleteMutation } = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setDeletingId(null);
      toast.success("Success");
    },
    onError() {
      setDeletingId(null);
      toast.error("Something went wrong. Please try again.");
    },
  });

  if (!notes || notes.length === 0) {
    return <p className={css.empty}>No notes found.</p>;
  }

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li className={css.listItem} key={note.id}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            {note.tag && <span className={css.tag}>{note.tag}</span>}

            <Link href={`/notes/${note.id}`} className={css.Details}>
              Details
            </Link>

            <button
              className={css.button}
              onClick={() => {
                setDeletingId(note.id);
                deleteMutation(note.id);
              }}
              disabled={deletingId === note.id}
            >
              {deletingId === note.id ? "Loading " : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}