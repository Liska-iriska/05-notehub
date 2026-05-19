import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import NoteList from "../NoteList/NoteList";
import NoteForm from "../NoteForm/NoteForm";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import toast, { Toaster } from "react-hot-toast";
import type { NoteTag } from "../../types/note";
import { fetchNotes, createNote, deleteNote } from "../../services/noteService";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import css from "./App.module.css";
import "modern-normalize";

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (newNote: { title: string; content: string; tag: NoteTag }) =>
      createNote(newNote.title, newNote.content, newNote.tag),
    onSuccess: () => {
      toast.success("Note created successfully!");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsCreateModalOpen(false);
    },
    onError: () => {
      toast.error("Failed to create note.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      toast.success("Note deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["notes", query, currentPage],
    queryFn: () => fetchNotes(query, currentPage),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isSuccess && data?.results.length === 0 && query.length > 0) {
      toast.error("No notes found for your request.");
    }
  }, [isSuccess, data, query]);

  const totalPages = data?.total_pages ?? 0;

  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    setCurrentPage(1);
  };

  return (
    <div className={css.app}>
      <Toaster position="top-right" />
      <header className={css.toolbar}>
        <SearchBox value={query} onSearch={handleSearch} />
        {isSuccess && totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <button
          className={css.button}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create note +
        </button>
      </header>
      {isError && <ErrorMessage />}
      {isLoading && <Loader />}
      {data && data.results.length > 0 && (
        <NoteList
          notes={data.results}
          onSelect={() => {}}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      )}
      {isCreateModalOpen && (
        <Modal onClose={() => setIsCreateModalOpen(false)}>
          <NoteForm
            onAdd={(values) =>
              createMutation.mutate(
                values as { title: string; content: string; tag: NoteTag },
              )
            }
          />
        </Modal>
      )}
    </div>
  );
}
