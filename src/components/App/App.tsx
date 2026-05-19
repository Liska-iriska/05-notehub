import { useState, useEffect } from "react";
import type { ComponentType } from "react";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import toast, { Toaster } from "react-hot-toast";
import type { Note } from "../../types/note";
import { fetchNotes, createNote, deleteNote } from "../../services/noteService";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import css from "./App.module.css";
import "modern-normalize";

export default function App() {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["notes", query, currentPage],
    queryFn: () => fetchNotes(query, currentPage),
    enabled: query.length > 0,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isSuccess && data?.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [isSuccess, data, query]);

  const totalPages = data?.total_pages ?? 0;

  const openModal = (noteObj: Note) => setSelectedNote(noteObj);
  const closeModal = () => setSelectedNote(null);

  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    setCurrentPage(1);
  };

  return (
    <div className={css.app}>
      <Toaster />
      <header className={css.toolbar}>
        <SearchBox onSubmit={handleSearch} />
        {isError && <ErrorMessage />}
        {isLoading && <Loader />}
        {isSuccess && totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <button className={css.button}>Create note +</button>
      </header>
      {data && data.results.length > 0 && (
        <NoteList notes={data.results} onSelect={openModal} />
      )}

      {selectedNote && <NoteList note={selectedNote} onClose={closeModal} />}
    </div>
  );
}
