import axios from "axios";
import type { Note } from "../types/note";

const instance = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
  },
});

interface HTTPResponse {
  results: Note[];
  total_pages: number;
}

export const fetchNotes = async (
  searchTerm: string,
  page: number = 1,
  perPage: number = 12,
) => {
  const response = await instance.get<HTTPResponse>("/notes", {
    params: {
      search: searchTerm,
      page,
      perPage,
    },
  });

  return response.data;
};

interface PostNoteResponse {
  title: string;
  content: string;
  tag: string;
}

export const createNote = async (
  title: string,
  content: string,
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping",
) => {
  const response = await instance.post<PostNoteResponse>("/notes", {
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
