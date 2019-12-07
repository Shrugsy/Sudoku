import React from 'react';
import './App.css';

const chunk = require('lodash.chunk');
//import Boards from './boards.js';
let Boards = require('./boards');
let difficulty = 'Easy';
let pencilMode = false;
let pencilModeStatus = 'Turn on Pencil'
let pencilModeButtonClass = 'btn btn-outline-primary btn-sm'
let pencilModeIconClass = 'far fa-edit';

const rows = 9;
const cols = 9;
const numSquares = rows * cols;

//TODO
//make recursive backtracking solving function
//use this to make the board (delete a cell until we have a single solution available)

let startingBoard = (Boards.selectRandomBoard(difficulty.toLowerCase())).split('').map((i)=> parseInt(i));

let status = 'Awaiting move.'
let activeSquare = -1;

//boardArray is a 9x9 array with vals 0-81
const boardArray = chunk([...Array(numSquares).keys()], cols)

function App() {
  return (
    <div className="App">
      <Game
      
      />
    </div>
  );
}


function Square(props) {
  let notes = <table className={'notesTable'}>
    <tbody className={'notesBody'}>
    <tr className={'notesTR'}>
      <td className={props.notesClassNames[0]}>{props.notes[0] !== 0 ? props.notes[0] : undefined}</td>
      <td className={props.notesClassNames[1]}>{props.notes[1] !== 0 ? props.notes[1] : undefined}</td>
      <td className={props.notesClassNames[2]}>{props.notes[2] !== 0 ? props.notes[2] : undefined}</td>
    </tr>
    <tr className={'notesTR'}>
      <td className={props.notesClassNames[3]}>{props.notes[3] !== 0 ? props.notes[3] : undefined}</td>
      <td className={props.notesClassNames[4]}>{props.notes[4] !== 0 ? props.notes[4] : undefined}</td>
      <td className={props.notesClassNames[5]}>{props.notes[5] !== 0 ? props.notes[5] : undefined}</td>
    </tr>
    <tr className={'notesTR'}>
      <td className={props.notesClassNames[6]}>{props.notes[6] !== 0 ? props.notes[6] : undefined}</td>
      <td className={props.notesClassNames[7]}>{props.notes[7] !== 0 ? props.notes[7] : undefined}</td>
      <td className={props.notesClassNames[8]}>{props.notes[8] !== 0 ? props.notes[8] : undefined}</td>
    </tr>
    </tbody>
  </table>

  let val = (props.value !== 0) ? props.value : notes;
  let squareStyle
  if (props.className === 'square'){
    squareStyle = (props.style !== '') ? {fontWeight: props.style, background: 'rgb(230, 230, 230)'} : {fontWeight: 'normal'};
  }
  else {
    squareStyle = (props.style !== '') ? {fontWeight: props.style} : {fontWeight: 'normal'};
  }
  return (
    <td
      id = {props.id}
      className = {props.className}
      style = {squareStyle}
      onClick = {props.onClick}
    >
      {val}
    </td>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key = {i}
        value = {this.props.squares[i]}
        notes = {this.props.notes[i]}
        notesClassNames = {this.props.notesClassNames[i]}
        className = {this.props.className[i]}
        style = {this.props.style[i]}
        onClick = {() => this.props.onClick(i)}
      />
    )
  }

  initialiseBoard() {
    //rows & cols are global letiables at top of file
  let allRows = boardArray.map((rowArr, idx) => 
    <tr key={idx}>
      {rowArr.map((i)=> 
        this.renderSquare(i)
      )}
    </tr>
  )

  let board = chunk(allRows, 3).map((val, idx) =>
    <tbody key={idx} className={'boardBody'}>
      {val}
    </tbody>
    )

    return board
  }

  render() {
    //note that the third colgroup isn't realistically necessary for this css to work
    return (
      <table style= {{width: '340px'}}>
        <colgroup><col span="3"></col></colgroup>
        <colgroup><col span="3"></col></colgroup>
        <colgroup><col span="3"></col></colgroup>
        {this.initialiseBoard()}
      </table>
    );
  }
}


function SquareOptions(props) {
  function formatProgress(currentOccurences) {
    let finalOccurences = 9
    return ((currentOccurences / finalOccurences) * 100).toFixed(0) + "%"
  }

  return (
    <div>
      <table
        style = {{borderCollapse: 'separate', width: '340px'}}
      >
        <tbody>
          <tr>
            {[...Array(cols).keys()].map((i) => 
            <td
              className = {props.progress[i] === 9 ? 'buttonOptionComplete' : 'buttonOption'}
              key={i}
              onClick = {() => props.onClick(i)}
            >
              {i+1}
            </td>
          )}
        </tr>
        <tr>
          {[...Array(9).keys()].map((i) =>
          <td
            className = {props.progress[i] === 9 ? 'numProgressComplete' : 'numProgress'}
            key={i}
          >
            {formatProgress(props.progress[i])}
          </td>
          )}
        </tr>
        </tbody>
      </table>
      
    </div>
  )
}

class Game extends React.Component {

  //initial setup
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          //squares: Array(numSquares).fill(null),
          squares: startingBoard,
          notes: Array(numSquares).fill(null).map(() => Array(9).fill(0)),
          progress: Array(9).fill(0),
        }],
        stepNumber: 0,
        squaresClassNames: Array(numSquares).fill('square'),
        notesClassNames : Array(numSquares).fill(null).map(() => Array(9).fill('notesTD')),
        style: Array(numSquares).fill(''),
      }
    } 

    highlightSquares(passedSquare, step = -1) {
      activeSquare = passedSquare;

      let current;

      const history = this.state.history;
      if (step === -1) {
        current = history[this.state.stepNumber];
      } else {
        current = history[step];
      }

      //const current = history[this.state.stepNumber];
      const squares = current.squares.slice();
      const notes = current.notes.slice().map((arr)=>{return arr.slice()});
      const notesClassNames = this.state.notesClassNames.slice().map((arr)=>{return arr.slice()});
      const squaresClassNames = this.state.squaresClassNames.slice();

       //set all to 'square'
       squaresClassNames.fill("square")     
       
       //soft highlight the row
       //let rowIndexes = getRowIndexes(boardArray, activeSquare)
       //let rowIndexes = new Position(boardArray, activeSquare).rowIndexes
       let position = new Position(boardArray, activeSquare)
       let rowIndexes = position.rowIndexes()
       let colIndexes = position.colIndexes()
       let blockIndexes = position.blockIndexes()

       //set all to 'notesTD'
       notesClassNames.fill(Array(9).fill(null).map(()=>"notesTD"))

       if (rowIndexes) {
         rowIndexes.vals.forEach((j) => {
           squaresClassNames[j] = "squareNearby";
         }
         )
       }
 
       //soft highlight the column
       //let colIndexes = getColIndexes(boardArray, activeSquare)
       if (colIndexes) {
         colIndexes.vals.forEach((j) =>
           squaresClassNames[j] = "squareNearby"
         )
       }
 
       //soft highlight the square of 9
       //let squareOfNineIndexes = getblockIndexes(activeSquare)
       if (blockIndexes) {
         blockIndexes.vals.forEach((j) =>
           squaresClassNames[j] = "squareNearby"
         )
       }
 
       //highlight the selected square
       squaresClassNames[activeSquare] = "squareMain"
 
       //TODO: make the cells flash?
       
       squares.forEach((val, idx) => {
         if (val === squares[activeSquare] & (activeSquare !== idx) & (squares[activeSquare] !== null) & (squares[activeSquare] !== 0)) {
           squaresClassNames[idx] = "squareMatching"
         }
       })

       notesClassNames.forEach((val, idx) => {
         notes[idx].forEach((v, i) => {
           if (v === squares[activeSquare] & (activeSquare !== idx) & (squares[activeSquare] !== null) & (squares[activeSquare] !== 0)) {
              notesClassNames[idx][i] = "notesMatching"
            }
          })
        })
       this.setState({
         squaresClassNames: squaresClassNames,
         notesClassNames: notesClassNames
       });
    }


    handleOptionClick(i, activeSquare) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      const squaresClassNames = this.state.squaresClassNames.slice();
      //note that we map & slice below so that the entire multi-dimensional array is copied, rather than just copying the references
      const notes = current.notes.slice().map((arr)=>{return arr.slice()});
      const notesClassNames = this.state.notesClassNames.slice().map((arr)=>{return arr.slice()});
      const progress = current.progress.slice();

      let val = i + 1

      let pos = new Position(boardArray, activeSquare)
      let rowArr = pos.rowIndexes().vals.map((idx) =>  squares[idx])
      let colArr = pos.colIndexes().vals.map((idx) =>  squares[idx])
      let blockArr = pos.blockIndexes().vals.map((idx) =>  squares[idx])

      //TODO
      //pencil mode active & cell already filled in?
      if (activeSquare === -1) {
        status = 'No square selected. Please check your moves!'
        this.setState({
          history: history
        })
      } else if (pencilMode) {     
        if (val === 0) {
          notes[activeSquare] = Array(9).fill(0);
          squares[activeSquare] = val;
          progress.forEach((val, idx) => {
            progress[idx] = countOccurences(squares, idx + 1)
          })
          status = 'Awaiting move.'
          this.setState({
            history: history.concat([{
                squares: squares,
                notes: notes,
                progress: progress
            }]),
            stepNumber: history.length,
            squaresClassNames: squaresClassNames,
            notesClassNames: notesClassNames
          })
        } else if (detectConflict(val, rowArr, colArr, blockArr) & val !== 0) {
          console.log('CONFLICTING VALUES')
          status = 'Conflicting cells found with value ' + val + '. Please check your moves!'
          this.setState({
            history: history
          })
        } else {
          notes[activeSquare][i] = notes[activeSquare][i] === 0 ? val : 0

          status = 'Awaiting move.'

          this.setState({
            history: history.concat([{
                squares: squares,
                notes: notes,
                progress: progress
            }]),
            stepNumber: history.length,
            squaresClassNames: squaresClassNames,
            notesClassNames: notesClassNames
          })
        }

      } else if (startingBoard[activeSquare] === 0) {        
        if (val === 0) {

          squares[activeSquare] = val;
          notes[activeSquare] = Array(9).fill(0);
          progress.forEach((val, idx) => {
            progress[idx] = countOccurences(squares, idx + 1)
          })

          status = 'Cell cleared. Awaiting move.'
          this.setState({
            history: history.concat([{
                squares: squares,
                notes: notes,
                progress: progress
            }]),
            stepNumber: history.length,
            squaresClassNames: squaresClassNames,
            notesClassNames: notesClassNames
          }, () => {
            this.highlightSquares(activeSquare)
          })
        } else if (squares[activeSquare] === val) {
          status = 'Cell already contains this value. Please check your moves!'
          this.setState({
            history: history
          })
        } else if (detectConflict(val, rowArr, colArr, blockArr) & val !== 0) {
          console.log('CONFLICTING VALUES')
          status = 'Conflicting cells found with value ' + val + '. Please check your moves!'
          this.setState({
            history: history
          })

        } else {

        //actually gets filled in here
        squares[activeSquare] = val  
        
        progress.forEach((val, idx) => {
          progress[idx] = countOccurences(squares, idx + 1)
        })

        //clear out conflicting notes

        let rowIndexes = pos.rowIndexes()
        let colIndexes = pos.colIndexes()
        let blockIndexes = pos.blockIndexes()

        rowIndexes.vals.forEach((arrVal, idx) => {
          notes[arrVal][val-1] = 0
        })
        colIndexes.vals.forEach((arrVal, idx) => {
          notes[arrVal][val-1] = 0
        })
        blockIndexes.vals.forEach((arrVal, idx) => {
          notes[arrVal][val-1] = 0
        })

        status = 'Awaiting move.'
        
        this.setState({
          history: history.concat([{
              squares: squares,
              notes: notes,
              progress: progress
          }]),
          stepNumber: history.length,
          squaresClassNames: squaresClassNames,
          notesClassNames: notesClassNames
        }, () => {
          this.highlightSquares(activeSquare)
        })
        
        }
      } else {
        console.log('Cannot change starting square')
        status = 'Cannot change starting square. Please check your moves!'
        this.setState({
            history: history
          })
      }

    }


    jumpTo(step) {
      if (step >= 0 && step < this.state.history.length){
        this.setState({
          stepNumber: step,
        });
        this.highlightSquares(activeSquare, step);
      }
    }

    togglePencilMode() {      
      if (pencilMode) {
        pencilMode = false;
        pencilModeButtonClass = 'btn btn-outline-primary btn-sm'
        pencilModeIconClass = 'far fa-edit'
        pencilModeStatus = 'Turn on Pencil'
        
      } else {
        pencilMode = true;
        pencilModeButtonClass = 'btn btn-primary btn-sm'
        pencilModeIconClass = 'fas fa-edit'
        pencilModeStatus = 'Turn off Pencil'
      }

      const history = this.state.history
      this.setState({
        history: history
      })
      return pencilMode
    }

    componentDidMount() {
      //only needs to run once at start
      const history = this.state.history.slice(0, 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      const notes = current.notes.slice().map((arr)=>{return arr.slice()});
      const progress = current.progress.slice();
      const style = this.state.style

      progress.forEach((val, idx) => {
        progress[idx] = countOccurences(squares, idx + 1)
      })

      for (let i = 0; i < squares.length; i += 1) {
        if (squares[i] !== 0) {
          style[i] = 'bold'
        }
      }
      this.setState({
        history: [{
          squares: squares,
          notes: notes,
          progress: progress
        }],
        style: style
      })
    }

    //following upon rendering
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      //note that this calls twice when inputting a value because it first renders the board, then highlights squares also (which renders again)
      //console.log(history);

      const undo = <button className={'btn btn-primary btn-sm'} onClick = {() => this.jumpTo(this.state.stepNumber-1)}><i className={'fas fa-undo'}></i>{' Undo'}</button>
      const redo = <button className={'btn btn-primary btn-sm'} onClick = {() => this.jumpTo(this.state.stepNumber+1)}><i className={'fas fa-redo'}></i>{' Redo'}</button>
      const pencilMode = <button className={pencilModeButtonClass} onClick = {() => this.togglePencilMode()}><i className={pencilModeIconClass}></i>{' '}{pencilModeStatus}</button>
      const clear = <button className={'btn btn-primary btn-sm'} onClick = {() => this.handleOptionClick(-1, activeSquare)}><i className={'far fa-trash-alt'}></i>{' Clear cell'}</button>
      //const solve = <button onClick = {() => startSolving(bArray)}>{'SOLVE'}</button>
      //const solve = <button onClick = {() => generateSudoku()}>{'generate'}</button>
      
      //may turn this into a 'case' and keep all status options together here or in a separate function
      //have winner return 'incomplete', 'complete', 'full but wrong values'
      status = winner ? 'Game succesfully completed! Congratulations!' : status;

      return (
        <div className="game">
          <h2>Sudoku</h2>
          <div className="game-board">
            <Board
              squares = {current.squares}
              className = {this.state.squaresClassNames}
              notesClassNames = {this.state.notesClassNames}
              notes = {current.notes}
              style = {this.state.style}
              onClick = {(i) => this.highlightSquares(i)}
            />
          </div>
          <div>
          {undo} {redo} {pencilMode} {clear}
          </div>
          <SquareOptions
            onClick = {(i) => this.handleOptionClick(i, activeSquare)}
            progress = {current.progress}
          />
          <h4>Status:</h4>
          <div>{status}</div>
        </div>
      )
    }

}

function countOccurences(array, val) {
  let occurences = 0
  for (let i = 0; i < array.length; i += 1) {
    if (array[i] === val) {
      occurences += 1
    }
  }
  return occurences
}


//TODO: return the original indices as well in order to easily identify all clashing cells
class Position {
  constructor(array, idx) {
    this.array = array;
    this.idx = idx;
  }

  rowIndexes() {
    //same as 'new Object()' but more concise and preferred
    let rowIndexes = {};

    for (let i = 0; i < this.array.length; i += 1) {
      if (this.array[i].indexOf(this.idx) > -1) {
        rowIndexes.vals = this.array[i]
        rowIndexes.indices = 'TODO'
        break;
      }
    }
    return rowIndexes
  }

  colIndexes() {
    let valIndex = false

    for (let i = 0; i < this.array.length; i += 1) {
      if (this.array[i].indexOf(this.idx) > -1) {
        valIndex = this.array[i].indexOf(this.idx)
        break;
      }
    }
  
    if (valIndex > -1) {
      let colIndexes = {};
      colIndexes.vals = Array(this.array.length)
      for (let i = 0; i < this.array.length; i += 1) {
        colIndexes.vals[i] = this.array[i][valIndex]
        colIndexes.indices = 'TODO'
      }
      return colIndexes
    } else {
      return false
    }
    
  }

  blockIndexes() {
    let squareOfNineIndexes = {};
    //let squareOfNineIndexes = false
    let possibleSquares = [
      [0, 1, 2, 9, 10, 11, 18, 19, 20],
      [3, 4, 5, 12, 13, 14, 21, 22, 23],
      [6, 7, 8, 15, 16, 17, 24, 25, 26],
      [27, 28, 29, 36, 37, 38, 45, 46, 47],
      [30, 31, 32, 39, 40, 41, 48, 49, 50],
      [33, 34, 35, 42, 43, 44, 51, 52, 53],
      [54, 55, 56, 63, 64, 65, 72, 73, 74],
      [57, 58, 59, 66, 67, 68, 75, 76, 77],
      [60, 61, 62, 69, 70, 71, 78, 79, 80]
    ]
  
    for (let i = 0; i < possibleSquares.length; i += 1) {
      if (possibleSquares[i].indexOf(this.idx) > -1) {
        squareOfNineIndexes.vals = possibleSquares[i];
        squareOfNineIndexes.indices = 'TODO'
        break;
      }
    }
  
    return squareOfNineIndexes
  }
}




//TODO: alter this to return square indices of the conflicting cells once the position class is altered
function detectConflict(value, rowArr, colArr, blockArr) {
  //let conflict = false;
  
  if (rowArr.indexOf(value) > -1) {
    return true;
  } else if (colArr.indexOf(value) > -1) {
    return true;
  } else if (blockArr.indexOf(value) > -1) {
    return true;
  } else {
    return false
  }
}

function calculateWinner(squares) {

  for (let i=0; i < squares.length; i += 1) {
    if (squares[i] === 0) {return false}
  }
  return true
}

//as opposed to 'ReactDOm.render... because we export to index.js which renders in there
export default App;
