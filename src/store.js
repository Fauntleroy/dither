import { readable } from 'svelte/store';

const pageVisible = readable(!document.hidden, (set) => {
  function handleVisibilityChange () {
    set(!document.hidden);
  }

  document.addEventListener(
    'visibilitychange',
    handleVisibilityChange,
    false
  );

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange, false);
  };
});

export { pageVisible };