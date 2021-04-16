class Maze {
    constructor(seed){
        this.dict = {};


        //console.log(seed);

        this.data = [seed];

        // Initilize every node
        for (let i = 1; i <= 8; i++){
            for (let j = 1; j <= 8; j++){
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

                // This is some stacked arrays so I'm just going to write down examples
                // This.dict[key][0] = [north, south, east, west] is an array with the KEYS to the tiles in the appropriate cardinal directions
                    // Thus This.dict[key][0][0] gives you the key to the tile NORTH of your initial key
                // This.dict[key][1] = [false, false, false, false] is an array of booleans representing whether the path in that cardinal direction is open
                    // Thus if This.dict[key][1][0] is true, there is a path open to the north
                // This.dict[key][2] = 0 is a numerical representation of the # of open paths
                    // This.dict[key][2] is derived from This.dict[key][1] by counting the number of True
                // This.dict[key][3] is a boolean representing whether or not this tile is adjacent to a 4way tile
                // This.dict[key][4] is a string representing bonus information about this room.
                // So most importantly, if you have a key 'x,y' - this.dict[ this.dict[x,y][0][0] ] is giving you the NODE to the north of your key 'x,y'
                this.dict[key] = [[north, south, east, west], [false, false, false, false], 0, false, "None"];
            }
        }

        let openedPaths = 0;



        let coinTable = pseudoRandomPathList(seed);
        let numFourWays = 0;

        //console.log("generated CoinTable");

        for (let i = 1; i <= 8; i++){
            for (let j = 1; j <= 8; j++){

                let key = i+','+j;
                //console.log(key);

                let northKey = this.dict[i+','+j][0][0];
                let westKey = this.dict[i+','+j][0][3];
                
                // For the wall between this & the tile north of this, flip a coin.
                if ( coinTable.shift() ){
                    // If either this or the north tile already has 3 paths
                    if( this.dict[key][2] == 3 || this.dict[northKey][2] == 3){
                        // If they both have 3 paths
                       if ( this.dict[key][2] == 3 && this.dict[northKey][2] == 3 ){
                            // do nothing
                        } // If this has 3 paths and is already adjacent to a fourway
                        else if (this.dict[key][2] == 3 && this.dict[key][3]){
                            // do nothing
                        } // If north tile has 3 paths and is already adjacent to a fourway
                        else if (this.dict[northKey][2] == 3 && this.dict[northKey][3]){
                            // do nothing
                        } // If we just have too many four ways
                        else if (numFourWays >= 6){
                            // do nothing
                        } else {
                            this.dict[key][1][0] = true;
                            this.updateWays(key);
                            this.dict[northKey][1][1] = true;
                            this.updateWays(northKey);
                            openedPaths += 1;
                            numFourWays += 1;
                        }
                    } else {
                        this.dict[key][1][0] = true;
                        this.updateWays(key);
                        this.dict[northKey][1][1] = true;
                        this.updateWays(northKey);
                        openedPaths += 1;
                    }
                }

                // For the wall between this & the tile west of this, flip a coin.
                // Same inner process as above.
                if ( coinTable.shift() ){
                    if( this.dict[key][2] == 3 || this.dict[westKey][2] == 3){
                        if ( this.dict[key][2] == 3 && this.dict[westKey][2] == 3 ){
                            // Do nothing
                        } else if (this.dict[key][2] == 3 && this.dict[key][3]){
                            // Do nothing
                        } else if (this.dict[westKey][2] == 3 && this.dict[westKey][3]){
                            // Do nothing
                        } else if (numFourWays >= 6){
                            // Do nothing
                        } else {
                            this.dict[key][1][3] = true;
                            this.updateWays(key);
                            this.dict[westKey][1][2] = true;
                            this.updateWays(westKey);
                            openedPaths += 1;
                            numFourWays += 1;
                        }
                    } else {
                        this.dict[key][1][3] = true;
                        this.updateWays(key);
                        this.dict[westKey][1][2] = true;
                        this.updateWays(westKey);
                        openedPaths += 1;
                    }
                }
            }
        }
        //console.log("Finished Generating!");
        //console.log(this.dict);


        let unexplored = JSON.parse(JSON.stringify(this.dict));
        let numFours = 0;
        let numEnds = 0;
        let numBlank = 0;

        for (let key in unexplored) {
            if (this.dict[key][2] == 4){
                //console.log(key + ": split a four way")
                let pathA = JSON.parse(JSON.stringify(unexplored[key]));
                pathA[1] = [true, true, false, false];
                let pathB = JSON.parse(JSON.stringify(unexplored[key]));
                pathB[1] = [false, false, true, true];
                unexplored[key+'a'] = pathA;
                unexplored[key+'b'] = pathB;
                unexplored[ unexplored[key][0][0] ][0][1] = key+'a';
                unexplored[ unexplored[key][0][1] ][0][0] = key+'a';
                unexplored[ unexplored[key][0][2] ][0][3] = key+'b';
                unexplored[ unexplored[key][0][3] ][0][2] = key+'b';
                numFours += 1;
                delete unexplored[key];
            } else if (this.dict[key][2] == 1){
                numEnds += 1;
            } else if (this.dict[key][2] == 0){
                numBlank += 1;
                delete unexplored[key];
                //console.log(key + ": ignored an empty")
            }
        }
        //console.log("Generated unexplored, about to run exploreAlg");
        //console.log(unexplored);

        let components = exploreMaze(unexplored);

        this.data.push(openedPaths);
        this.data.push(components.length);
        this.data.push(numFours);
        this.data.push(numEnds);
        this.data.push(numBlank);
        //console.log("Paths opened: " + openedPaths);
        console.log(components);

        //connect them???

        //place important locations
    }

    checkWays(boolList){
        let paths = 0;

        for(let i = 0; i< boolList.length; i++){
            if (boolList[i]){
                paths += 1;
            }
        }

        return paths;
    }

    updateWays(key){
        let paths = 0;

        this.dict[key][1].forEach(element => {
            if (element){
                paths += 1;
            }
        });

        this.dict[key][2] = paths;

        if (paths == 4){
            this.dict[key][3] = true;
            this.dict[ this.dict[key][0][0] ][3] = true;
            this.dict[ this.dict[key][0][1] ][3] = true;
            this.dict[ this.dict[key][0][2] ][3] = true;
            this.dict[ this.dict[key][0][3] ][3] = true;
        }

        return paths;
    }
}

function pseudoRandom(seed){
    return (Math.pow(seed, 2) % 50515093);
}

function exploreMaze(unexplored){
    let explored = [];
    let fullMap = JSON.parse(JSON.stringify(unexplored));
    let components = -1;

    while (Object.keys(unexplored).length > 0) {
        var keys = Object.keys(unexplored);
        let key = keys[ keys.length * Math.random() << 0];

        //console.log("started a component at: " + key);
        components += 1;
        explored.push([]);

        let toExplore = [key];
        delete unexplored[key];
    
        while (toExplore.length > 0){

            let currLoc = toExplore[0];
            for (var i = 0; i <= 3; i++){
                // IF (there is a path) AND (that path leads somewhere we're not already planning to go) AND (that path leads somewhere we haven't already gone)
                if (fullMap[currLoc][1][i] && !(toExplore.includes(fullMap[currLoc][0][i])) && !(explored[components].includes(fullMap[currLoc][0][i]))){
                    // We want to add that location to our explore list
                    // Add new place to our queue
                    toExplore.push(fullMap[currLoc][0][i]);
                    // Remove from unexplored.
                    delete unexplored[ fullMap[currLoc][0][i] ];
                } 
            }
            // Add the node we just fully explored to our explored list.
            explored[components].push(currLoc);
            // And remove it from our queue
            toExplore.shift();
        }
    }
    // Whatever is left in unexplored is NOT connected to the starting point.
    return explored;
}

function pseudoRandomPathList(seed){
    let result = [];
    let trueCount = 0;
    for (let i = 0; i <= 127; i++){
        seed = pseudoRandom(seed);
        if (seed%2 == 1){
            result.push(true);
            trueCount += 1;
        } else {
            result.push(false);
        }
    }

    if (trueCount > 64) {
        return result;
    } else {
        return pseudoRandomPathList(seed);
    }
}