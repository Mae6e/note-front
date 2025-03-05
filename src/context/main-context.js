import react, { useState } from 'react';

export const MainContext = react.createContext({
  zIndexNote: 1,
  changezIndex: (e) => {},
});

const MainContextProvider = (props) => {
  const [highzIndexNote, setHighzIndexNote] = useState(1);
  const highzIndexNoteHandler = (index) => {
    setHighzIndexNote(index);
  };

  return (
    <MainContext.Provider
      value={{
        zIndexNote: highzIndexNote,
        changezIndex: highzIndexNoteHandler,
      }}
    >
      {props.children}
    </MainContext.Provider>
  );
};

export default MainContextProvider;
