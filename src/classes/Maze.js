class Maze {
    constructor(seed){
        this.dict = {};

        // Initilize every node
        for (var i = 1; i <= 8; i++){
            for (var j = 1; j <= 8; j++){
                let key = i + ',' + j;
                let north = i + ',' + (j-1);
                let south = i + ',' + (j+1);
                let east = (i+1) + ',' + j;
                let west = (i-1) + ',' + j;
                if (i == 1){
                    if (j <= 4){
                        west = 8 + ',' + (j+4);
                    } else{
                        west = 8 + ',' + (j-4);
                    }
                }
                if (i == 8){
                    if (j <= 4){
                        east = 1 + ',' + (j+4);
                    } else {
                        east = 1 + ',' + (j-4);
                    }
                }
                if (j == 1){
                    if (i <= 4){
                        north = i+4 + ',' + 8;
                    } else {
                        north = i-4 + ',' + 8;
                    }
                }
                if (j == 8){
                    if (i <= 4){
                        south = i+4 + ',' + 1;
                    } else {
                        south = i-4 + ',' + 1;
                    }
                }

                this.dict[key] = [[north, south, east, west], [false, false, false, false], "None"];
            }
        }

        for (i = 1; i <= 8; i++){
            for (j = 1; j <= 8; j++){
                //top adjacent
                seed = pseudoRandom(seed);
                if ( seed % 2 == 1 ){
                    this.dict[i+','+j][1][0] = true;
                    this.dict[ this.dict[i+','+j][0][0] ][1][1] = true;
                }

                //left adjacent
                seed = pseudoRandom(seed);
                if ( seed % 2 == 1 ){
                    this.dict[i+','+j][1][3] = true;
                    this.dict[  this.dict[i+','+j][0][3]  ][1][2] = true;
                }
            }
        }

        let unexplored = {};

        for (let key in this.dict) {
            if (this.dict[key][1] == [true, true, true, true]){
                let pathA = this.dict[key];
                pathA[1] = [true, true, false, false];
                let pathB = this.dict[key];
                pathB[1] = [false, false, true, true];
                unexplored[key+'a'] = pathA;
                unexplored[key+'b'] = pathB;
            } else {
                unexplored[key] =  this.dict[key];
            }
        }

        let disconnected = exploreMaze(unexplored, '1,1');

        console.log(disconnected);

        console.log(this.dict);

        //connect them???

        //place important locations
    }
}

function pseudoRandom(seed){
    return (Math.pow(seed, 2) % 50515093);
}

function exploreMaze(unexplored, startingPoint){
    let explored = [];
    let toExplore = [startingPoint];
    let fullMap = {...unexplored};
    
    delete unexplored[ startingPoint ];

    while (toExplore.length > 0){

        let currLoc = toExplore[0];
        

        for (var i = 0; i <= 3; i++){
            // IF (there is a path) AND (that path leads somewhere we're not already planning to go) AND (that path leads somewhere we haven't already gone)
            if (fullMap[currLoc][1][i] && !(toExplore.includes(fullMap[currLoc][0][i])) && !(explored.includes(fullMap[currLoc][0][i]))){
                // We want to add that location to our explore list
                // If it's not in Explored, toExplore, or Unexplored, that means it's one of the special nodes. (Or we fucked up)
                if (!(fullMap[currLoc][0][i] in unexplored)){
                    console.log("pathh was a four way");
                    if(i <= 1){
                        // If we're heading north or south, it's a special 'a' node.
                        // Add it to our queue
                        toExplore.push(fullMap[currLoc][0][i]+'a');
                        // Remove from unexplored
                        delete unexplored[ fullMap[currLoc][0][i]+'a' ];
                    } else {
                        // If we're heading east or west, it's a special 'b' node.
                        // Add it to our queue
                        toExplore.push(fullMap[currLoc][0][i]+'b');
                        // Remove from unexplored
                        delete unexplored[ fullMap[currLoc][0][i]+'b' ];
                    }
                } else {
                    // Add new place to our queue
                    toExplore.push(fullMap[currLoc][0][i]);
                    // Remove from unexplored.
                    delete unexplored[ fullMap[currLoc][0][i] ];
                }
            } 
        }
        // Add the node we just fully explored to our explored list.
        explored.push(currLoc);
        // And remove it from our queue
        toExplore.shift();
    }
    // Whatever is left in unexplored is NOT connected to the starting point.
    return unexplored;
}

