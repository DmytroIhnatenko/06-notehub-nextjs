import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import NotesClient from '@/app/notes/Notes.client';
import { fetchNotes } from '@/lib/api';

export default async function App() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', '', 1],
    queryFn: () => fetchNotes(1, 12),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient/>
    </HydrationBoundary>
  );
}