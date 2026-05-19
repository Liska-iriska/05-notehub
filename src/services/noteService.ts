import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const instance = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
  },
});

interface HTTPResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  searchTerm: string,
  page: number = 1,
  perPage: number = 12,
) => {
  const response = await instance.get<HTTPResponse>("/notes", {
    params: {
      search: searchTerm.trim() || undefined,
      page,
      perPage,
    },
  });

  return response.data;
};

export const createNote = async (
  title: string,
  content: string,
  tag: NoteTag,
): Promise<Note> => {
  const response = await instance.post<Note>("/notes", {
    title,
    content,
    tag,
  });
  return response.data;
};

export const deleteNote = async (id: string) => {
  const response = await instance.delete(`/notes/${id}`);
  return response.data;
};
