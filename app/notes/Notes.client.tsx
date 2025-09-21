'use client';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useQuery } from '@tanstack/react-query';
import NoteList from '@/components/NoteList/NoteList';
import Modal from '@/components/Modal/Modal';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import NoteForm from '@/components/NoteForm/NoteForm';
import { fetchNotes } from '@/lib/api';
import Loading from '@/app/loading';
import { Toaster } from 'react-hot-toast';
import css from '../notes/NotePage.module.css';

const NotesClient = () => {
  const [query, setQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [showLoader, setShowLoader] = useState<boolean>(false);

  const onQueryChange = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPage(1);
      setQuery(e.target.value);
    },
    500
  );

  const {
    data: notes,
    isLoading,
    isFetching,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ['notes', query, page],
    queryFn: () => fetchNotes(page, 12, query),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  if ((isLoading || isFetching) && !showLoader) {
    setShowLoader(true);
  } else if (!isLoading && !isFetching && showLoader) {
    setTimeout(() => setShowLoader(false), 300);
  }

  const totalPages = notes?.totalPages ?? 1;
  const handleClose = () => setIsModalOpen(false);

  return (
    <div className={css.app}>
      <Toaster />
      <header className={css.toolbar}>
        <SearchBox onChange={onQueryChange} />
        {totalPages > 1 && (
          <Pagination totalPages={totalPages} page={page} setPage={setPage} />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>
      {showLoader ? (
        <Loading />
      ) : (
        isSuccess &&
        notes && (
          <NoteList
          
          
            notes={notes.notes}
         
          />
        )
      )}
      {isModalOpen && (
        <Modal onClose={handleClose}>
          <NoteForm
            onClose={handleClose}
          />
        </Modal>
      )}
      {error && (
        <p className={css.error}>
          Could not fetch notes.{' '}
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      )}
    </div>
  );
};

export default NotesClient;


