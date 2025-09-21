import axios from "axios";
import type { Note, NoteId } from "@/types/note";

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

axios.defaults.baseURL = "https://notehub-public.goit.study/api";
axios.defaults.headers.common["Authorization"] = `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`;

export const fetchNotes = async (
  page: number =0,
  perPage: number =5,
  search?: string
): Promise<NotesResponse> => {
  const params: Record<string, string | number> = { page: Math.max(1,page), perPage };
  if (search) params.search = search;
  const { data } = await axios.get<NotesResponse>("/notes", { params });
  return data;
};

export const createNote = async (
  newNote: Omit<Note, "id" | "createdAt" | "updatedAt">
) => {
  const { data } = await axios.post<Note>("/notes", newNote);
  return data;
};

export const deleteNote = async (noteId: NoteId) => {
  const { data } = await axios.delete<Note>(`/notes/${noteId}`);
  return data;
};

export const fetchNoteById = async (noteId: NoteId): Promise<Note> => {
  const { data } = await axios.get<Note>(`/notes/${noteId}`);
  return data;
};