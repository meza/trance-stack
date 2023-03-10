export const sensorScript = () => {
  const cl = document.firstElementChild?.classList;
  if (!(cl?.contains('dark') || cl?.contains('light'))) {
    cl?.add(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }
};

export const updateScript = () => {
  addEventListener('load', ()=> {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      const cl = document.firstElementChild?.classList;
      cl?.remove(e.matches ? 'light' : 'dark');
      cl?.add(e.matches ? 'dark' : 'light');
    });
  });
};
