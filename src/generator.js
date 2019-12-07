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