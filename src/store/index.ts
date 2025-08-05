import { configureStore } from '@reduxjs/toolkit';
import { vehicleMakeApi } from './services/vehicleMakeApi'; // Uskoro ćemo ovo kreirati

export const store = configureStore({
  reducer: {
    // Dodajte vaše API slice-ove ovdje
    [vehicleMakeApi.reducerPath]: vehicleMakeApi.reducer,
    // Možete dodati i druge reducere ako ih budete imali
  },
  // Obavezno dodajte middleware iz RTK Queryja
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(vehicleMakeApi.middleware),
});

// Definirajte tipove za RootState i AppDispatch
// To je ključno za TypeScript u Reduxu
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
