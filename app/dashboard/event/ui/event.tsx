// 'use client';
// import { useSearchParams } from 'next/navigation';
// import React, { useEffect, useRef, useState } from 'react';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { useToast } from '@/components/ui/use-toast';
// import { SearchIcon } from 'lucide-react';
// import { Tables } from '@/types/database.types';
// import { IValidationErrors } from '@/types';
// import { Player } from '@lottiefiles/react-lottie-player';
// import Image from 'next/image';

// export default function Event() {
//   const formRef = useRef<HTMLFormElement>(null);
//   const searchParams = useSearchParams();
//   const eventId = searchParams.get('eventId');
//   const { data: event, isLoading } = useEvent(String(eventId));
//   const queryClient = useQueryClient();
//   const toast = useToast();
//   const [errors, setErrors] = useState<
//     IValidationErrors<any> | null | undefined
//   >();

//   const [eventName, setEventName] = useState<string>(event?.data?.name ?? '');
//   const [selectedBooks, setSelectedBooks] = useState<any[]>(
//     event?.data?.books ?? []
//   );
//   useEffect(() => {
//     if (event?.data?.books) {
//       setSelectedBooks(event.data.books);
//     }
//     if (event?.data?.name) {
//       setEventName(event.data.name);
//     }
//   }, [event?.data]);
//   const [searchQuery, setSearchQuery] = useState<string>('');
//   const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

//   const { data: books } = useBooks({
//     search: {
//       'books.title': [
//         {
//           operator: 'ilike',
//           value: `%${searchQuery}%`
//         }
//       ]
//     },
//     page: 1,
//     limit: 4
//   });

//   const handleSelectBook = (book: IBookPopulated) => {
//     if (!selectedBooks.some((selectedBook) => selectedBook.id === book.id)) {
//       setSelectedBooks((prev) => [...prev, book]);
//       setSearchQuery('');
//       setShowSuggestions(false);
//     }
//   };

//   const handleRemoveBook = (bookId: string) => {
//     setSelectedBooks((prev) => prev.filter((book) => book.id !== bookId));
//   };

//   const updateEventMutation = useMutation({
//     mutationFn: async () => {
//       const payload = {
//         name: eventName,
//         books_ids: selectedBooks.map((book) => book.id)
//       };
//       const url = getEndpoint({
//         resourse: 'events',
//         action: eventId ? 'updateEvent' : 'createEvent'
//       });
//       const method = eventId ? 'PATCH' : 'POST';
//       const { error, validationErrors } = await CRUDData<
//         Tables<'events'>,
//         IEventPayload
//       >({ method, url: url(String(eventId)), payload });
//       if (error || validationErrors) {
//         if (validationErrors) {
//           setErrors(validationErrors);
//         }
//         throw new Error(error ?? '');
//       }
//     },
//     onSuccess: () => {
//       toast.toast({
//         description: eventId
//           ? 'تمت عملية تعديل الفعالية بنجاح'
//           : 'تمت عملية إضافة الفعالية بنجاح'
//       });
//       if (!eventId && formRef.current) {
//         formRef.current.reset();
//         setEventName('');
//         setSelectedBooks([]);
//       }
//       queryClient.invalidateQueries({ queryKey: ['events'] });
//     },
//     onError: (error) => {
//       toast.toast({
//         description: eventId
//           ? 'حدث خطأ أثناء عملية تعديل'
//           : 'حدث خطأ أثناء عملية الإضافة'
//       });
//     }
//   });
//   if (isLoading)
//     return (
//       <div className="m-auto flex min-h-screen items-center justify-center">
//         <Player
//           autoplay
//           loop
//           src="/loading.json"
//           style={{ height: '10rem', width: '10rem' }}
//         />
//       </div>
//     );
//   return (
//     <form
//       ref={formRef}
//       onSubmit={(e) => {
//         e.preventDefault();
//         updateEventMutation.mutate();
//       }}
//     >
//       <div className="mb-4">
//         <label htmlFor="eventName" className="mb-2 block font-semibold">
//           اسم الفعالية
//         </label>
//         <input
//           type="text"
//           id="eventName"
//           value={eventName}
//           onChange={(e) => setEventName(e.target.value)}
//           className="w-full rounded-sm border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-color2"
//         />
//         {errors?.name?.map((err, index) => (
//           <p key={index} className="mt-2 text-red-500">
//             {err}
//           </p>
//         ))}
//       </div>

//       <div className="relative mb-4">
//         <label className="mb-2 block font-semibold">البحث عن كتب</label>
//         <div className="flex items-center gap-2 rounded border border-gray-300 p-2 shadow-sm">
//           <input
//             type="text"
//             placeholder="بحث ..."
//             value={searchQuery}
//             onChange={(e) => {
//               setSearchQuery(e.target.value);
//               setShowSuggestions(true);
//             }}
//             onBlur={() => setShowSuggestions(false)}
//             onFocus={() => setShowSuggestions(true)}
//             className="w-full rounded-lg focus:outline-none"
//           />
//           <button type="button" className="p-2">
//             <SearchIcon size={15} />
//           </button>
//         </div>

//         {showSuggestions && (books?.data?.data?.length ?? 0) > 0 && (
//           <div className="absolute  w-full border bg-white shadow-md">
//             {books?.data?.data
//               .filter(
//                 (book) =>
//                   !selectedBooks.some(
//                     (selectedBook) => selectedBook.id === book.id
//                   )
//               )
//               .map((book) => (
//                 <div
//                   key={book.id}
//                   onMouseDown={() => handleSelectBook(book)}
//                   className="flex cursor-pointer items-center gap-2 p-2 hover:bg-gray-100"
//                 >
//                   <Image
//                     src={book.images_urls[0] ?? '/empty-book.svg'}
//                     width={50}
//                     height={50}
//                     alt=""
//                   />
//                   <span>{book.title}</span>
//                 </div>
//               ))}
//           </div>
//         )}
//       </div>

//       <div className="mb-4">
//         <label className="mb-2 block font-semibold">الكتب المختارة</label>
//         {errors?.books_ids?.map((err, index) => (
//           <p key={index} className="mt-2 text-red-500">
//             {err}
//           </p>
//         ))}
//         <div className="flex flex-wrap gap-2">
//           {selectedBooks.map((book) => (
//             <div key={book.id} className="flex items-center gap-2 rounded  p-2">
//               <Image
//                 src={book.images_urls[0] ?? '/empty-book.svg'}
//                 width={50}
//                 height={50}
//                 alt=""
//               />
//               <span>{book.title}</span>

//               <button
//                 type="button"
//                 onClick={() => handleRemoveBook(book.id)}
//                 className="text-2xl font-bold text-red-500"
//               >
//                 x
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       <button
//         type="submit"
//         className="rounded bg-color2 px-4 py-3 text-lg text-white shadow-lg transition-opacity hover:opacity-80"
//         disabled={updateEventMutation.isPending}
//       >
//         {updateEventMutation.isPending
//           ? 'جاري المعالجة...'
//           : eventId
//           ? 'تعديل الفعالية'
//           : 'إضافة فعالية'}
//       </button>
//     </form>
//   );
// }
