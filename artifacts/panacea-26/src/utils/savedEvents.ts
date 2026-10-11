export interface SavedEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  venue: string;
  category?: string;
  image?: string;
}

const STORAGE_KEY = "panacea_saved_events";

/* =========================================================
   GET SAVED EVENTS
========================================================= */

export function getSavedEvents(): SavedEvent[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(
      "Failed to read saved events:",
      error
    );

    return [];
  }
}

/* =========================================================
   SAVE EVENT
========================================================= */

export function saveEvent(event: SavedEvent): void {
  const events = getSavedEvents();

  const alreadySaved = events.some(
    (savedEvent) => savedEvent.id === event.id
  );

  if (alreadySaved) {
    return;
  }

  const updatedEvents = [
    ...events,
    event,
  ];

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedEvents)
  );

  /*
   * Notify other parts of the application
   * that saved events changed.
   */
  window.dispatchEvent(
    new Event("panacea:saved-events")
  );
}

/* =========================================================
   REMOVE EVENT
========================================================= */

export function removeSavedEvent(
  eventId: string
): void {
  const events = getSavedEvents();

  const updatedEvents = events.filter(
    (event) => event.id !== eventId
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedEvents)
  );

  window.dispatchEvent(
    new Event("panacea:saved-events")
  );
}

/* =========================================================
   CHECK IF SAVED
========================================================= */

export function isEventSaved(
  eventId: string
): boolean {
  return getSavedEvents().some(
    (event) => event.id === eventId
  );
}

/* =========================================================
   CLEAR ALL
========================================================= */

export function clearSavedEvents(): void {
  localStorage.removeItem(STORAGE_KEY);

  window.dispatchEvent(
    new Event("panacea:saved-events")
  );
}