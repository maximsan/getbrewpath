import { type RefObject, useEffect } from 'react';

interface ModalMenu {
  open: boolean;
  /** The menu's state setter. React keeps it the same across renders, so the effect never re-runs for it. */
  setOpen: (open: boolean) => void;
  /** The top bar, which stays usable while the menu covers the page. */
  bar: RefObject<HTMLElement | null>;
  menuId: string;
  /** The button that opens the menu. Escape moves focus back to it. */
  menuButton: RefObject<HTMLButtonElement | null>;
  /** A media query. The menu closes once the screen matches it. */
  closesAt: string;
}

/**
 * While the menu is open, the page under it neither scrolls nor takes keyboard
 * focus. Escape closes the menu, and so does a screen that grows to `closesAt`.
 */
export function useModalMenu({ open, setOpen, bar, menuId, menuButton, closesAt }: ModalMenu) {
  useEffect(() => {
    if (!open) {
      return;
    }
    const unlockPage = lockPageBehind([bar.current, document.getElementById(menuId)]);
    const stopListening = closeOnEscapeOrWideScreen(setOpen, menuButton, closesAt);

    return () => {
      unlockPage();
      stopListening();
    };
  }, [open, setOpen, bar, menuId, menuButton, closesAt]);
}

/**
 * Stops the page from scrolling and makes every top-level element except `keep`
 * inert, the skip link included. Returns the function that undoes both.
 */
function lockPageBehind(keep: (Element | null)[]) {
  const pageBehind = Array.from(document.body.children).filter(
    (element): element is HTMLElement =>
      element instanceof HTMLElement && !keep.includes(element) && !element.inert,
  );

  document.body.style.overflow = 'hidden';
  pageBehind.forEach((element) => (element.inert = true));

  return () => {
    document.body.style.overflow = '';
    pageBehind.forEach((element) => (element.inert = false));
  };
}

/** Closes the menu on Escape or once the screen matches `closesAt`. Returns the function that stops listening. */
function closeOnEscapeOrWideScreen(
  setOpen: (open: boolean) => void,
  menuButton: RefObject<HTMLButtonElement | null>,
  closesAt: string,
) {
  const wide = window.matchMedia(closesAt);
  const closeWhenWide = () => {
    if (wide.matches) {
      setOpen(false);
    }
  };
  const closeOnEscape = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') {
      return;
    }
    setOpen(false);
    menuButton.current?.focus();
  };

  wide.addEventListener('change', closeWhenWide);
  document.addEventListener('keydown', closeOnEscape);

  return () => {
    wide.removeEventListener('change', closeWhenWide);
    document.removeEventListener('keydown', closeOnEscape);
  };
}
