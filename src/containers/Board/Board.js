import { useState, useEffect, useReducer, useCallback } from 'react';
import NewNote from '../NewNote/NewNote';
import AxiosNote from '../../AxiosNote';
import './Board.css';
import NoteList from '../NoteList/NoteList';
import btnAdd from '../../constants/add.png';

const Board = () => {
  const noteReducer = (state, action) => {
    switch (action.type) {
      case 'ADD':
      case 'SET':
        return [...state, action.note];
      case 'DELETE':
      case 'EDIT':
        return action.notes;
      default:
        throw new Error('Not Valid');
    }
  };

  const [notes, dispatch] = useReducer(noteReducer, []);

  const [style, setStyle] = useState('');
  const [showNewNote, setShowNewNote] = useState(false);

  const widthScreen = window.innerWidth;
  const heightScreen = window.innerHeight;
  const [positionMap, setPositionMap] = useState(() => new Map());

  const mapPositionHandler = () => {
    var rows = parseInt(widthScreen / 180);
    var cells = parseInt(heightScreen / 180);
    for (let row = 1; row <= rows; row++) {
      for (let cell = 1; cell <= cells; cell++) {
        setPositionMap(positionMap.set(`${row}-${cell}`, false));
      }
    }
  };

  if (positionMap.size === 0) {
    mapPositionHandler();
  }

  const getKey = useCallback(
    (val) => {
      let items = [...positionMap].find(([key, value]) => val === value);
      if (items !== undefined) {
        setPositionMap(positionMap.set(items[0], true));
        return items[0];
      } else {
        [...positionMap.keys()].forEach((key) => {
          setPositionMap(positionMap.set(key, false));
        });
        items = [...positionMap].find(([key, value]) => val === value);
        return items[0];
      }
    },
    [positionMap, setPositionMap]
  );

  const positionCalculationHandler = useCallback((positionMapItem) => {
    return {
      left: (positionMapItem.split('-')[0] - 1) * 180 + 40 + 'px',
      top: (positionMapItem.split('-')[1] - 1) * 180 + 20 + 'px',
      transform: 'rotate(' + randomBetweenHandler(-5, 6, 'transform') + 'deg)',
    };
  }, []);

  const randomBetweenHandler = (min, max) => {
    return min + Math.ceil(Math.random() * max);
  };

  useEffect(() => {
    return () => {
      AxiosNote.get('note.json').then((response) => {
        if (response.data) {
          const data = Object.keys(response.data);
          for (let index = 0; index < data.length; index++) {
            const position = positionCalculationHandler(getKey(false));
            dispatch({
              note: {
                note: {
                  id: data[index],
                  title: response.data[data[index]].title,
                },
                style: position,
              },
              type: 'SET',
            });
          }
        }
      });
    };
  }, [getKey, positionCalculationHandler]);

  const onSaveHandler = (item) => {
    AxiosNote.post('note.json', item).then((response) => {
      dispatch({
        note: {
          note: { id: response.data.name, ...item },
          style: style,
        },
        type: 'ADD',
      });
    });
    setShowNewNote(false);
  };

  const onEditHandler = (item) => {
    AxiosNote.patch(`note/${item.id}.json`, item).then((response) => {
      const loadedNotes = notes;
      let updatedNote = loadedNotes.find((x) => x.note.id === item.id);
      updatedNote = { ...item };
      loadedNotes[updatedNote] = updatedNote;
      dispatch({ notes: loadedNotes, type: 'EDIT' });
    });
  };

  const onDeleteHandler = (id) => {
    AxiosNote.delete(`note/${id}.json`).then((response) => {
      let updatedNotes = notes.filter((x) => x.note.id !== id);
      dispatch({ notes: updatedNotes, type: 'DELETE' });
    });
  };

  const onShowHandler = (event) => {
    event.preventDefault();
    if (!showNewNote) {
      setStyle(positionCalculationHandler(getKey(false)));
      setShowNewNote(true);
    }
  };

  return (
    <div className="board">
      <NoteList style={style} Notes={notes} onEditNote={onEditHandler} onDeleteNote={onDeleteHandler} />
      {showNewNote ? <NewNote style={style} onSaveNote={onSaveHandler} /> : null}
      <button className="btn-add" onClick={onShowHandler}>
        <img src={btnAdd} alt="add"></img>
      </button>
    </div>
  );
};

export default Board;
