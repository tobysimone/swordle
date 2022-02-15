import { useEffect, useState, useRef } from 'react';
import { use100vh } from 'react-div-100vh';
import moment from 'moment';
import './App.css';
import allWords from './word-list.json';

const MAX_WORD_LENGTH = 5;
const MAX_GUESSES = 6;
const FIRST_DATE = moment("2022-02-14");

const letterState = {
  default: 'default',
  present: 'present',
  absent: 'absent',
  correct: 'correct'
}

const App = () => {
  const [words, setWords] = useState([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [gameBoardHeight, setGameBoardHeight] = useState(500);
  const [correctWord, setCorrectWord] = useState('');
  const gameBoardRef = useRef(null);

  const height = use100vh();
  
  const getWord = _ => {
    let word = words[currentRow];
    if(!word) {
      word = [];
    } else if(word.length >= MAX_WORD_LENGTH) {
      word = word.slice(0, MAX_WORD_LENGTH);
    }

    return word;
  }

  const updateWord = word => {
    let updatedWords = words;
    updatedWords[currentRow] = word;
    setWords([...updatedWords]);
  }

  const addLetterToWord = letter => {
    let word = getWord();
    if(word.length >= MAX_WORD_LENGTH) {
      return;
    }

    word.push({ letter: letter, state: letterState.default });
    updateWord(word);
  }

  const onKeyPress = letter => {
    if(!isValidLetter(letter)) {
      return;
    }

    addLetterToWord(letter);
  }

  const onDeletePress = _ => {
    const word = getWord();
    word.pop();
    updateWord(word);
  }

  const onEnterPress = _ => {
    const word = getWord();
    if(word.length != MAX_WORD_LENGTH) {
      return;
    }

    const updatedWord = word;
    for(let i = 0; i < word.length; i++) {
      updatedWord[i].state = scoreLetter(updatedWord[i].letter.toLowerCase(), correctWord.toLowerCase(), i);
    }

    updateWord(updatedWord);
    setCurrentRow(currentRow + 1);
  }

  useEffect(() => {
    setGameBoardHeight(gameBoardRef.current.clientHeight);
  });

  useEffect(() => {
    const today = moment();
    const elapsed = today.diff(FIRST_DATE, "days");
    setCorrectWord(allWords[elapsed]);
    console.log(correctWord);
  }, []);

  return (
    <div className={'window-container'} style={{ height: height }}>
      <div className={'header'}>
        Swordle
      </div>
      <div className={'board-container'} ref={gameBoardRef}>
        <div className={'game-container'} style={{ width: gameBoardHeight * 0.80 }}>
          {[...Array(MAX_GUESSES)].map((_, i) => {
            return <WordRow key={i} word={words[i]} current={currentRow === i} />
          })}
        </div>
      </div>
      <div className={'keyboard-container'}>
        <KeyboardRow>
          <KeyboardKey letter={'Q'} onClick={onKeyPress} />
          <KeyboardKey letter={'W'} onClick={onKeyPress} />
          <KeyboardKey letter={'E'} onClick={onKeyPress} />
          <KeyboardKey letter={'R'} onClick={onKeyPress} />
          <KeyboardKey letter={'T'} onClick={onKeyPress} />
          <KeyboardKey letter={'Y'} onClick={onKeyPress} />
          <KeyboardKey letter={'U'} onClick={onKeyPress} />
          <KeyboardKey letter={'I'} onClick={onKeyPress} />
          <KeyboardKey letter={'O'} onClick={onKeyPress} />
          <KeyboardKey letter={'P'} onClick={onKeyPress} />
          <KeyboardKey letter={'Å'} onClick={onKeyPress} />
        </KeyboardRow>
        <KeyboardRow>
          <KeyboardKey letter={'A'} onClick={onKeyPress} />
          <KeyboardKey letter={'S'} onClick={onKeyPress} />
          <KeyboardKey letter={'D'} onClick={onKeyPress} />
          <KeyboardKey letter={'F'} onClick={onKeyPress} />
          <KeyboardKey letter={'G'} onClick={onKeyPress} />
          <KeyboardKey letter={'H'} onClick={onKeyPress} />
          <KeyboardKey letter={'J'} onClick={onKeyPress} />
          <KeyboardKey letter={'K'} onClick={onKeyPress} />
          <KeyboardKey letter={'L'} onClick={onKeyPress} />
          <KeyboardKey letter={'Ö'} onClick={onKeyPress} />
          <KeyboardKey letter={'Ä'} onClick={onKeyPress} />
        </KeyboardRow>
        <KeyboardRow inset>
          <KeyboardKey letter={'↵'} onClick={onEnterPress} double />
          <KeyboardKey letter={'Z'} onClick={onKeyPress} />
          <KeyboardKey letter={'X'} onClick={onKeyPress} />
          <KeyboardKey letter={'C'} onClick={onKeyPress} />
          <KeyboardKey letter={'V'} onClick={onKeyPress} />
          <KeyboardKey letter={'B'} onClick={onKeyPress} />
          <KeyboardKey letter={'N'} onClick={onKeyPress} />
          <KeyboardKey letter={'M'} onClick={onKeyPress} />
          <KeyboardKey letter={'⌫'} onClick={onDeletePress} double />
        </KeyboardRow>
      </div>
    </div>
  );
}

const isValidLetter = letter => {
  if(!letter || letter.length > 1) {
    return false;
  }

  return /[a-zA-ZöäåÖÄÅ]{1}/.test(letter)
}

const scoreLetter = (letter, correctWord, index) => {
  if(letter === correctWord[index]) {
    return letterState.correct;
  } else if(correctWord.includes(letter)) {
    return letterState.present;
  } else {
    return letterState.absent;
  }
}

const WordRow = ({ word = [], current }) => {
  return (
      <div className={'word-row'}>
        {[...Array(MAX_WORD_LENGTH)].map((_, i) => {
          return <Tile key={i} letter={word[i] && word[i].letter} state={word[i] && word[i].state} />
        })}
      </div>
  );
}

const Tile = ({ letter, state }) => {
  return (
    <div className={`tile ${state ? state : ''}`}>
      {letter}
    </div>
  )
}

const KeyboardRow = ({ inset, children }) => {
  return (
    <div className={'keyboard-row'}>
      {inset ? (<KeyboardKeySpace />) : undefined}
      {children}
      {inset ? (<KeyboardKeySpace />) : undefined}
    </div>
  )
}

const KeyboardKeySpace = _ => {
  return (
    <div style={{ flex: 0.7 }}></div>
  )
}

const KeyboardKey = ({ letter, double, noMargin, onClick }) => {
  return (
    <button className={`key`} style={{ flex: double ? 1.5 : 1, margin: noMargin ? 0 : '0 3px 0 3px' }} onClick={_ => onClick && onClick(letter)}>
      {letter}
    </button>
  )
}

const Notification = ({ message }) => {
  return (
    <div className='notification'>
      {message}
    </div>
  )
}

export default App;