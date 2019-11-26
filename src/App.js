import React from 'react';
import './App.css';

const chunk = require('lodash.chunk');
//import Boards from './boards.js';
let Boards = require('./boards');

var difficulty = 'Easy'

const rows = 9;
const cols = 9;
const numSquares = rows * cols;


var startingBoard = (Boards.selectRandomBoard(difficulty.toLowerCase())).split('').map((i)=> parseInt(i));


/*
var bstr = '016002400320009000040103000005000069009050300630000800000306010000400072004900680'
//let bstr = '123456789456789123789123456231564897564897231897231564312645978645978312978312645'
//let bstr = generateSudoku()
var bArray = bstr.split('').map((i)=> parseInt(i))

let startingBoard = bArray
*/

//bArray = Array(81).fill(0)

//startingBoard = startingBoard.map((i)=> parseInt(i))

//TODO temporary, use the above generator for final
//var startingBoard = bArray

//TODO
//var solvedBoard = generateSudoku()
//now remove values from it to get the starting board

//var startingBoard = generateSudoku()

let status = 'Awaiting move.'
//console.log(startingBoard)

//BIG TODO
//make recursive backtracking solving function
//use this to make the board (delete a cell until we have a single solution available)


//const numSquares = 81;

let activeSquare = -1;

//boardArray is a 9x9 array with vals 0-81
const boardArray = chunk([...Array(numSquares).keys()], cols)
//console.log(boardArray)

function App() {
  return (
    <div className="App">
      <Game
      
      />
    </div>
  );
}

//TODO
//have an inner table
//fiddle with this later
// function Notes() {
//   return (
//     <table className = "notes">
//     <tbody className = "notes">
//       <tr className = "notes">
//         <td className = "notes">1</td>
//         <td className = "notes">2</td>
//         <td className = "notes">3</td>
//       </tr>
//       <tr className = "notes">
//         <td className = "notes">4</td>
//         <td className = "notes">5</td>
//         <td className = "notes">6</td>
//       </tr>
//       <tr className = "notes">
//         <td className = "notes">7</td>
//         <td className = "notes">8</td>
//         <td className = "notes">9</td>
//       </tr>
//     </tbody>
//   </table>
//   )
// }

//<Notes></Notes>
function Square(props) {
  let val = (props.value !== 0) ? props.value : undefined;
  //console.log(props.style)
  //let squareStyle = (props.style !== '') ? {fontWeight: 'bold', background: 'rgb(210, 210, 210)'} : {fontWeight: 'normal'};
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
      //style = {{height: '100px'}}
      //style = {{fontWeight: 'bold'}}
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
        className = {this.props.className[i]}
        style = {this.props.style[i]}
        onClick = {() => this.props.onClick(i)}
      />
    )
  }

  initialiseBoard() {
    //rows & cols are global variables at top of file
  let allRows = boardArray.map((rowArr, idx) => 
    <tr key={idx}>
      {rowArr.map((i)=> 
        this.renderSquare(i)
      )}
    </tr>
  )

  let board = chunk(allRows, 3).map((val, idx) =>
    <tbody key={idx}>
      {val}
    </tbody>
    )

    return board
  }

  render() {
    //note that the third colgroup isn't realistically necessary for the css to work
    return (
      <table>
        <caption>{difficulty} difficulty</caption>
        <colgroup><col span="3"></col></colgroup>
        <colgroup><col span="3"></col></colgroup>
        <colgroup><col span="3"></col></colgroup>
        {this.initialiseBoard()}
      </table>
    );
  }
}

//{fontWeight: 'normal'}

// border-collapse: collapse; 
//TODO
//put these in a table to they are evenly spaced with the sudoku itself
function SquareOptions(props) {
  console.log(props.progress)

  function formatProgress(currentOccurences) {
    let finalOccurences = 9
    return ((currentOccurences / finalOccurences) * 100).toFixed(0) + "%"
  }

  return (
    <div>
      <br></br>
      <table
        style = {{borderCollapse: 'separate', width: '340px'}}
      >
        <tbody>
          <tr>
            {[...Array(cols).keys()].map((i) => 
            <td
              className = 'buttonOption'
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
            className = 'numProgress'
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
          progress: Array(9).fill(0),
        }],
        stepNumber: 0,
        squaresClassNames: Array(numSquares).fill('square'),
        style: Array(numSquares).fill(''),
      }
      
    } 

    highlightSquares(passedSquare, step = -1) {
      //console.log('board array')
      //console.log(boardArray)
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

       if (rowIndexes) {
         rowIndexes.vals.forEach((j) =>
           squaresClassNames[j] = "squareNearby"
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
 
       //highlight any matching numbers, and make the cells flash?
       //console.log('curr: ')
       //console.log(current)

       squares.forEach((val, idx) => {
         if (val === squares[activeSquare] & (activeSquare !== idx) & (squares[activeSquare] !== null) & (squares[activeSquare] !== 0)) {
           //console.log(squares[activeSquare])
           squaresClassNames[idx] = "squareMatching"
         }
       })
       
       this.setState({
         squaresClassNames: squaresClassNames
       });
    }


    handleOptionClick(i, activeSquare) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      const squaresClassNames = this.state.squaresClassNames.slice();
      const progress = current.progress.slice();

      let val = i + 1

      if (activeSquare === -1) {
        status = 'No square selected. Please check your moves!'
        this.setState({
          history: history
        })
      } else if (startingBoard[activeSquare] === 0) {

        let pos = new Position(boardArray, activeSquare)
        let rowArr = pos.rowIndexes().vals.map((idx) =>  squares[idx])
        let colArr = pos.colIndexes().vals.map((idx) =>  squares[idx])
        let blockArr = pos.blockIndexes().vals.map((idx) =>  squares[idx])
        
        if (squares[activeSquare] === val) {
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
        //TODO
        //only do this if the activeSquare is not one of the starting squares!
        //also only do this if the value is not a mistake, otherwise add to list of mistakes!
        squares[activeSquare] = val  
        
        progress.forEach((val, idx) => {
          progress[idx] = countOccurences(squares, idx + 1)
        })

        status = 'Awaiting move.'
        
        this.setState({
          history: history.concat([{
              squares: squares,
              progress: progress
          }]),
          stepNumber: history.length,
          squaresClassNames: squaresClassNames
        }, () => {
          this.highlightSquares(activeSquare)
        })
        //this.highlightSquares(activeSquare)
        
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
      
    }

    componentDidMount() {
      //only needs to run once at start
      const history = this.state.history.slice(0, 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
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
      console.log(history);

      const undo = <button onClick = {() => this.jumpTo(this.state.stepNumber-1)}>{'Undo'}</button>
      const redo = <button onClick = {() => this.jumpTo(this.state.stepNumber+1)}>{'Redo'}</button>
      const pencilMode = <button onClick = {() => this.togglePencilMode()}>{'Pencil Mode'}</button>
      const clear = <button onClick = {() => this.handleOptionClick(-1, activeSquare)}>{'Clear cell'}</button>
      
      //const solve = <button onClick = {() => startSolving(bArray)}>{'SOLVE'}</button>
      //const solve = <button onClick = {() => generateSudoku()}>{'generate'}</button>
      //NOTE: check if the board is full but something is incorrect?
      //may turn this into a 'case'
      //have winner return 'incomplete', 'complete', 'full but wrong values'
      status = winner ? 'Game succesfully completed! Congratulations!' : status;

      return (
        <div className="game">
          <h2>Sudoku!</h2>
          <div className="game-board">
            <Board
              squares = {current.squares}
              className = {this.state.squaresClassNames}
              style = {this.state.style}
              onClick = {(i) => this.highlightSquares(i)}
            />
          </div>
          <SquareOptions
            onClick = {(i) => this.handleOptionClick(i, activeSquare)}
            progress = {current.progress}
          />
          <div className = "game-info">
          <br></br>
          <div>
          {undo} {redo} {pencilMode} {clear}
          </div>
          <h4>Status:</h4>
          <div>{status}</div>


          </div>
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

//keeping this here mainly for testing in console
//e.g. let t = make2DArray(9, 9)
/* 
function make2DArray(rows, cols) {
  let array = [];
  for (let i = 0; i < rows; i += 1) {
    let row = [];
    for (let j = 0; j < cols; j += 1) {
      row.push(i*rows + j)
    }
    array.push(row)
  }
  return array
} 
*/

//return the original indices as well!
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
      //console.log(colIndexes)
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

// function getRowIndexes(array, idx) {
//   let rowIndexes = false

//   for (let i = 0; i < array.length; i += 1) {
//     if (array[i].indexOf(idx) > -1) {
//       rowIndexes = array[i]
//       break;
//     }
//   }

//   console.log(rowIndexes)
//   return rowIndexes
// }

// function getColIndexes(array, idx) {
//   let valIndex = false

//   for (let i = 0; i < array.length; i += 1) {
//     if (array[i].indexOf(idx) > -1) {
//       valIndex = array[i].indexOf(idx)
//       break;
//     }
//   }

//   if (valIndex) {
//     let colIndexes = Array(array.length)
//     for (let i = 0; i < array.length; i += 1) {
//       colIndexes[i] = array[i][valIndex]
//     }
//     return colIndexes
//   } else {
//     return false
//   }
// }

// //alternatively can do the below based on row & col
// function getblockIndexes(val) {
//   let squareOfNineIndexes = false
//   let possibleSquares = [
//     [0, 1, 2, 9, 10, 11, 18, 19, 20],
//     [3, 4, 5, 12, 13, 14, 21, 22, 23],
//     [6, 7, 8, 15, 16, 17, 24, 25, 26],
//     [27, 28, 29, 36, 37, 38, 45, 46, 47],
//     [30, 31, 32, 39, 40, 41, 48, 49, 50],
//     [33, 34, 35, 42, 43, 44, 51, 52, 53],
//     [54, 55, 56, 63, 64, 65, 72, 73, 74],
//     [57, 58, 59, 66, 67, 68, 75, 76, 77],
//     [60, 61, 62, 69, 70, 71, 78, 79, 80]
//   ]

//   for (let i = 0; i < possibleSquares.length; i += 1) {
//     if (possibleSquares[i].indexOf(val) > -1) {
//       squareOfNineIndexes = possibleSquares[i];
//       break;
//     }
//   }

//   return squareOfNineIndexes
// }



// function generateBoard() {
//   let filledArray = Array(81)
//   //console.log(filledArray);

//   filledArray.forEach(()=> {

//   })

//   return filledArray;
// }

//var bstr = '016002400320009000040103000005000069009050300630000800000306010000400072004900680'
//var bArray = bstr.split('').map((i)=> parseInt(i))

/* function startSolving(array) {
  let tryLimit = 100;
  let numTries = 0;

  let t = solveSudoku(array, numTries, tryLimit)
  //console.log('t:')
  console.log(t)
  
}


//below needs work
function solveSudoku(origArray, numTries, tryLimit) {
  //array should be size 81 (9 x 9)
  //global constant 'boardArray' is also used in this function

  //do this to make a copy and not alter the original array
  let array = origArray.slice()


  if (array.length === 81) {
    console.log('trying to solve on try: ' + numTries)
    array.forEach((val, idx) => {
      if (!isNaN(val) && (val > 0)) {
        //is a number
        //console.log('is a filled number: ' + val)
      } else {
        //console.log('not a filled number: ' + val)
        //try a solution now
        for (let i = 1; i < 9; i += 1) {
          //check if present in row, col or square
          //console.log(idx)
          let pos = new Position(boardArray, idx)
          //console.log(pos)
          let row = pos.rowIndexes()
          let col = pos.colIndexes()
          let block = pos.blockIndexes()

          //console.log(row)
          //console.log(col)
          //check if 'i' is present in the corresponding boardArray value

          //let val = (props.value !== 0) ? props.value : undefined;
          var present = false
          row.forEach((checkIDX) => {
            if ((array[checkIDX]) === i) {present = true}
          })
          col.forEach((checkIDX) => {
            if ((array[checkIDX]) === i) {present = true}
          })
          block.forEach((checkIDX) => {
            if ((array[checkIDX]) === i) {present = true}
          })
          if (!present) {
            array[idx] = i
            break;
          }

        }
        //solvedArray[val ] = i
        //solvedArray[val] = array[val]
      }
    })

    if (numTries == tryLimit) {
      console.log('error: limit of' + tryLimit + 'tries reached');
      console.log(array)
      return array;
    } else if (array.indexOf(0) > -1) {
      //console.log('keep going')
      numTries += 1

      //try again
      return solveSudoku(array, numTries, tryLimit);
    } else {
      return array;
    }

    //console.log(array);
    //return array;
  } else {
    console.log('Expected array of length 81. Array length: ' + array.length);
    return false;
  }
} */


//alter this to return square indices of the conflicting cells
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


/* function randBetweenInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
} */

//make a function 'genNewSudoku' with a confirmation request



/* function generateSudoku() {

  function get2RandsFrom(min, max) {
    let nums = [...Array(max-min + 1).keys()].map((i)=> i + min)
    
    let rnd1 = randBetweenInclusive(min,max)

    for (let j=0; j < nums.length; j += 1) {
      if (nums[j] === rnd1) {nums.splice(j, 1)}
    }
    //console.log(nums)
    //let cutNums = nums.splice()
    //get a random between 0-7 inclusive, and use this as the index from the new array with a missing number
    //this gives a random number from the new array
    //7
    //console.log(nums.length)
    let rnd2 = nums[randBetweenInclusive(0,nums.length-1)]
    return [rnd1, rnd2]
  }

  //console.log(get2Rands1to9())
  //first row 123456789
  //second row 456789123
  //third row 789123456
  let initString = '123456789456789123789123456231564897564897231897231564312645978645978312978312645'
  let newString = initString;
  //let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  //let nums = [...Array(9).keys()].map((i)=> i + 1)
  //shuffle digits 30 times
  for (let i=0; i < 30; i += 1) {

    //swap these numbers in the initial string
    //replace first number with 't'
    //replace second number with first number
    //replace 't' with second number
    let [rnd1, rnd2] = get2RandsFrom(1,9)
    newString = newString.replace(new RegExp(rnd1.toString(), 'g'), 't');
    newString = newString.replace(new RegExp(rnd2.toString(), 'g'), rnd1.toString());
    newString = newString.replace(/t/g, rnd2.toString());
  }

  let newArray = newString.split('').map((i)=> parseInt(i))


  //chunk([...Array(numSquares).keys()], cols)

  newArray = chunk(newArray, cols)
  //console.log('new array')
  //console.log(JSON.parse(JSON.stringify(newArray)))

  //re-arrange columns 1,2,3
  //re-arrange columns 4,5,6
  //re-arrange columns 7,8,9
  //for i = 0:3

  //re-arrange column blocks
  for (let i = 0; i < 3; i += 1) {
    //perform 5 times for randomness
    for (let n = 0; n < randBetweenInclusive(5,6); n += 1) {
      let [rnd1, rnd2] = get2RandsFrom(0+3*i,2+3*i)
      //for each row
      for (let j = 0; j < newArray.length; j += 1) {
        [newArray[j][rnd1], newArray[j][rnd2]] = [newArray[j][rnd2], newArray[j][rnd1]];
      }
    }
  }

  //console.log('new array after column switching')
  //console.log(JSON.parse(JSON.stringify(newArray)))

  //re-arrange row blocks
  //re-arrange rows 1,2,3
  //re-arrange rows 4,5,6
  //re-arrange rows 7,8,9  

  for (let i = 0; i < 3; i += 1) {
    for (let n = 0; n < randBetweenInclusive(5,6); n += 1) {
      let [rnd1, rnd2] = get2RandsFrom(0+3*i, 2+3*i)
      //console.log('rand rows')
      //console.log(rnd1)
      //console.log(rnd2)
      for (let j = 0; j < newArray.length; j += 1) {
        [newArray[rnd1][j], newArray[rnd2][j]] = [newArray[rnd2][j], newArray[rnd1][j]];
      }
    }
  }
  

  //TODO: IS THIS REALLY NECESSSARY?
  //randomly re-arrange in 3 column groups of size 9 x 3 (e.g. re-order 3 columns, but grouped by block)
  //same for row groups

  //console.log('rearranged new array')
  //console.log(newArray)
  
  //turn back into 1d array
  return [].concat(...newArray);
} */

//TODO: show progress bar


function calculateWinner(squares) {

  for (let i=0; i < squares.length; i += 1) {
    if (squares[i] === 0) {return false}
  }
  return true
}

//as opposed to 'ReactDOm.render... because we export to index.js which renders in there
export default App;