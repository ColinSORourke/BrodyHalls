// Maze is my abstraction of the endless halls. 
// It takes a constructor with a seed, and generates a graph representing an endless halls map.
// for any given seed, I am using a Blum Blum Shub Pseudo-random generator - so the behavior is entirely deterministic given the seed.

class Maze {
    constructor(seed){

        this.dict = {};

        this.data = [seed];

        // Initialize every node
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

                // This is some stacked arrays so I'm just going to write down examples to explain my info structure
                // Each key is a string that is "x,y"
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

        


        // Coin Table is a randomly organized list of 128 booleans, with at least 64 True
        let coinTable = pseudoRandomPathList(seed);

        // Just some info I want to store
        let numFourWays = 0;
        let openedPaths = 0;

        // Lets talk about the maze - there are 64 tiles in an 8x8 grid that 'loop' across the edge.
        // This means there are 128 possible 'paths' between pairs of tiles
        // An easy way to iterate over all 128 paths is to iterate over all 64 tiles, and operate on 2 'paths' per tile
        // If you operate on the paths in a consistent two cardinal directions, that means you will have operated on each path once by the end of this loop
        // So I iterate over all 64 tiles, flipping a coin for that Tile's North&West path to decide whether that path is open or closed.
        // With some extra caveats of course
        // Also note: I frequently call this.updateWays() for some Info Management
        for (let i = 1; i <= 8; i++){
            for (let j = 1; j <= 8; j++){

                let key = i+','+j;

                let northKey = this.dict[i+','+j][0][0];
                let westKey = this.dict[i+','+j][0][3];
                
                // For the wall between this & the tile north of this, flip a coin.
                // (Flip a coin means shift the first element of my boolean array off)
                if ( coinTable.shift() ){
                    // THIS WHOLE BLOCK OF IF STATEMENTS is to prevent 4-way rooms from being adjacent to each other & to only have less than 8

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
                        else if (numFourWays >= 8){
                            // do nothing
                        } else {
                            // If we are in this statement we are successfully creating a 4-way path.
                            this.dict[key][1][0] = true;
                            this.updateWays(key);
                            this.dict[northKey][1][1] = true;
                            this.updateWays(northKey);
                            openedPaths += 1;
                            numFourWays += 1;
                        }
                    } else {
                        // We are opening up a normal path.
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
                        } else if (numFourWays >= 8){
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

        // Here I have to make a copy "Unexplored" of my map for my Pathfinding algorithm to function.
        let unexplored = JSON.parse(JSON.stringify(this.dict));
        let deadEnds = [];
        let numFours = 0;
        let numBlank = 0;

        // I also want to modify that "Unxplored in a few ways"
        for (let i = 1; i <= 8; i++){
            for (let j = 1; j <= 8; j++){
                let key = i + ',' + j;

                // Four way rooms, due to their non-euclidean behavior, have to be split into two nodes
                // I mark these nodes a & b, a for North/South, b for East/West
                if (this.dict[key][2] == 4){
                    // Create two new nodes
                    let pathA = JSON.parse(JSON.stringify(unexplored[key]));
                    pathA[1] = [true, true, false, false];
                    let pathB = JSON.parse(JSON.stringify(unexplored[key]));
                    pathB[1] = [false, false, true, true];
                    unexplored[key+'a'] = pathA;
                    unexplored[key+'b'] = pathB;

                    // Update all the nodes adjacent to this four way to have proper key references
                    unexplored[ unexplored[key][0][0] ][0][1] = key+'a';
                    unexplored[ unexplored[key][0][1] ][0][0] = key+'a';
                    unexplored[ unexplored[key][0][2] ][0][3] = key+'b';
                    unexplored[ unexplored[key][0][3] ][0][2] = key+'b';
                    numFours += 1;

                    // remove original node from unxplored.
                    delete unexplored[key];
                } else if (this.dict[key][2] == 1){
                    // Here I'm just counting # of deadends.
                    deadEnds.push(key);
                } else if (this.dict[key][2] == 0){
                    // Here I'm counting # of empty rooms, and removing empty rooms from Unexplored
                        // Note I don't think the original endless halls could have empty tiles?? I'm not 100% sure, and I was uninterested in connecting them up
                    numBlank += 1;
                    delete unexplored[key];
                }
            }
        }            

        // I call my Pathfinding function which returns me an array of the different disconnected components by key.
        let components = exploreMaze(unexplored);

        // Find the largest component.
        let largeComp = 0;
        let largeCompInd = 0;
        for (let i = 0; i< components.length; i++){
            if (largeComp < components[i].length){
                largeComp = components[i].length;
                largeCompInd = i;
            }
        }
        
        
        // Now we may have several components which we want to connect somehow into one large component.
        // For every component
        let unconnected = true;
        for (let i = 0; i< components.length; i++){
            unconnected = true;
            // If this component is NOT the main component
            if (i != largeCompInd){
                let thisComp = components[i];
                // Go through every key in this componenet
                for (let j = 0; j < thisComp.length; j++){
                    let key = thisComp[j];
                    // If this is a four way, don't bother.
                    if ( key.length <= 3){
                        // If this key is a dead end
                        if ( this.dict[key][2] == 1 ) {
                            // Attempting to connect dead end tile to adjacent dead ends"
                            // Go through all the adjacencies of this tile
                            let dirSwap = [1, 0, 3, 2];
                            for (let k = 0; k < 4; k++){
                                // If there is a dead end adjacent to this tile
                                let adjKey = this.dict[key][0][k]
                                // If the adjacent tile is a dead end AND the adjacent tile is part of the main component
                                if ( this.dict[adjKey][2] == 1 && components[largeCompInd].includes(adjKey)){
                                    // Connected dead end tile to an adjacent dead end
                                    this.dict[key][1][k] = true;
                                    this.updateWays(key);
                                    this.dict[adjKey][1][dirSwap[k]] = true;
                                    this.updateWays(adjKey);
                                    openedPaths += 1;
                                    if (unconnected) {
                                        components[largeCompInd] = components[largeCompInd].concat(thisComp);
                                    }
                                    unconnected = false;
                                }
                            }
                            // If still unconnected
                            if (unconnected){
                                // We'll accept connecting our dead end to an adjacent two way tile.
                                for (let k = 0; k < 4; k++ ){
                                    // If there is a 2 way path adjacent to this tile
                                    let adjKey = this.dict[key][0][k]
                                    if ( this.dict[adjKey][2] == 2 && components[largeCompInd].includes(adjKey)){
                                        // Connected dead end tile to adjacent two way tile;
                                        this.dict[key][1][k] = true;
                                        this.updateWays(key);
                                        this.dict[adjKey][1][dirSwap[k]] = true;
                                        this.updateWays(adjKey);
                                        openedPaths += 1;
                                        unconnected = false;
                                        k = 4;
                                        components[largeCompInd] = components[largeCompInd].concat(thisComp);
                                    } 
                                }
                            }
                        }
                        // If we couldn't connect this tiles dead ends to anything
                        // Or we didn't have any dead ends
                        // We'll accept connecting a two way tile in this component to something two or less adjacent
                        else if ( this.dict[key][2] == 2 && unconnected){
                            // Attempting to connect 2 way tile to adjacents
                            let dirSwap = [1, 0, 3, 2];
                            for (let k = 0; k < 4; k++){
                                // If there is a tile two or less next to this tile
                                let adjKey = this.dict[key][0][k]
                                if ( this.dict[adjKey][2] <= 2 && components[largeCompInd].includes(adjKey)){
                                    // Connected 2 way tile to an adjacent tile
                                    this.dict[key][1][k] = true;
                                    this.updateWays(key);
                                    this.dict[adjKey][1][dirSwap[k]] = true;
                                    this.updateWays(adjKey);
                                    openedPaths += 1;
                                    unconnected = false;
                                    k = 4;
                                    components[largeCompInd] = components[largeCompInd].concat(thisComp);
                                }
                            }
                        } 
                    }
                    
                }
                // If we've reached this point, and our component still hasn't connected to anything, just void it out (this is extremely rare)
                if (unconnected){
                    for (let j = 0; j < thisComp.length; j++){
                        let key = thisComp[j];
                        this.dict[key][1] = [false, false, false, false];
                        this.dict[key][2] = 0;
                    }
                }
            }
        }

        deadEnds = [];
        numFours = 0;
        numBlank = 0;

        // Count some basic info again
        for (let i = 1; i <= 8; i++){
            for (let j = 1; j <= 8; j++){
                let key = i + ',' + j;
                if (this.dict[key][2] == 4){
                    numFours += 1;
                } else if (this.dict[key][2] == 1){
                    deadEnds.push(key);
                } else if (this.dict[key][2] == 0){
                    numBlank += 1;
                }
            }
        }

        //Add all this info to Maze.data
        this.data.push(openedPaths);
        this.data.push(components.length);
        this.data.push(numFours);
        this.data.push(deadEnds.length);
        this.data.push(numBlank);

        // And finally we place the important locations, the colored orbs and their destinations.
        let specialRoles = ["RedStart", "RedEnd", "BlueStart", "BlueEnd", "GreenStart", "GreenEnd", "YellowStart", "YellowEnd", "PurpleStart", "PurpleEnd"];
        let offlimits = [];

        // For each important location
        for (let i = 0; i < specialRoles.length; i++){
            // Pick a random location
            seed = pseudoRandom(seed);
            let key = ( Math.floor(seed/8) % 8 + 1) + ',' + ( seed%8 + 1);

            // If that random location
                // is NOT a four way
                // is NOT an empty tile
                // Doesn't already have ANOTHER important location
                // And is not 'offlimits'
            // We place our Important Spot there
            if (this.dict[key][2] != 4 && this.dict[key][2] != 0 && this.dict[key][4] == "None" && !offlimits.includes(key)){
                this.dict[key][4] = specialRoles[i];
                // Then we adjust an offlimits list so we don't place two important locations right next to eachother.
                offlimits = []
                offlimits = offlimits.concat(this.dict[key][0]);
                offlimits = offlimits.concat(this.dict[ this.dict[key][0][0] ][0]);
                offlimits = offlimits.concat(this.dict[ this.dict[key][0][1] ][0]);
                offlimits = offlimits.concat(this.dict[ this.dict[key][0][2] ][0]);
                offlimits = offlimits.concat(this.dict[ this.dict[key][0][3] ][0]);
            } else {
                // Else try again.
                i -= 1;
            }
        }
        
        let placedStart = false;

        while (!placedStart){
            seed = pseudoRandom(seed);
            let key = ( Math.floor(seed/8) % 8 + 1) + ',' + ( seed%8 + 1);

            if (this.dict[key][2] != 4 && this.dict[key][2] != 0 && this.dict[key][4] == "None" && this.dict[key][2] != 1 && !offlimits.includes(key) ){
                this.dict[key][4] = "StartingRoom";
                this.start = key;
                placedStart = true;
            }
        }

        // Then we also want to place the trap room, which is limited to dead ends.
        // Select a random DeadEnd key
        seed = pseudoRandom(seed);
        let trapInd = seed % deadEnds.length;
        let trapNode = deadEnds[trapInd];

        // If that dead end had an important role
        if (this.dict[trapNode][4] != "None"){
            // Pick up that important role, find it another spot.
            let otherTreasure = this.dict[trapNode][4]
            while (this.dict[trapNode][4] == otherTreasure){
                // Same logic as above
                seed = pseudoRandom(seed);
                let key = ( Math.floor(seed/8) % 8 + 1) + ',' + ( seed%8 + 1);
                console.log(key);
                if (this.dict[key][2] != 4 && this.dict[key][2] != 0 && this.dict[key][4] == "None"){
                    this.dict[key][4] = otherTreasure;
                    this.dict[trapNode][4] = "TrapRoom";
                }
            }
        } else {
            // Else just plop that trap down.
            this.dict[trapNode][4] = "TrapRoom";
        }


    }


    // This is our function checkWays, which just counts the number of True in a boolean array (like the array representing open paths)
    checkWays(boolList){
        let paths = 0;

        for(let i = 0; i< boolList.length; i++){
            if (boolList[i]){
                paths += 1;
            }
        }

        return paths;
    }

    // This is our update ways function.
    updateWays(key){
        // Count the number of Open Paths  
        let paths = 0;
        this.dict[key][1].forEach(element => {
            if (element){
                paths += 1;
            }
        });
        this.dict[key][2] = paths;

        // If this room is a four way, update the field of all adjacent rooms to say they are next to a four way. This is important for not placing Four Ways right next to eachother
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

// Simple implementation of Blum Blum Shub using 50515093 as our M, and 5807, 8699 as our P&Q
// See: https://en.wikipedia.org/wiki/Blum_Blum_Shub
function pseudoRandom(seed){
    return (Math.pow(seed, 2) % 50515093);
}


// This is our explore algorithm we use to determine the connectedness of our Maze
function exploreMaze(unexplored){
    // A fairly standard pathfinder, we have a list of all locations we haven't explored, a queue of locations we know a path to, and a list of locations we've fully explored.
    let explored = [];
    let fullMap = JSON.parse(JSON.stringify(unexplored));
    // Sometimes not every tile is reachable from our starting point, we could have isolated subgraphs called components - this is to track them.
    let components = -1;

    // While unexplored still has nodes
    while (Object.keys(unexplored).length > 0) {
        // Pick a starting point
        var keys = Object.keys(unexplored);
        let key = keys[0];
        // If this while loop runs a second time, it means we explored everythhing we could reach from our starting point, but still have tiles we know we haven't actually reached - other components.
        components += 1;
        // Push a sublist onto explored to represent this component.
        explored.push([]);

        // Start exploring!
        let toExplore = [key];
        delete unexplored[key];
    
        // As long as we know more spots we can reach
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

// This is the function that produces my coin table - it takes the seed 
function pseudoRandomPathList(seed){
    let result = [];
    let trueCount = 0;
    for (let i = 0; i <= 127; i++){
        seed = pseudoRandom(seed);
        // I actually give it a 52% chance of giving me a 'True', I want generally more than 64 open walls.
        if (seed%100 >= 47){
            result.push(true);
            trueCount += 1;
        } else {
            result.push(false);
        }
    }

    // Here I enforce a minimum 64 True. Mazes with less than 64 open walls are less interesting, and tend to have more isolated components
    while (trueCount < 64) {
        let removed = result.shift();
        if (removed){
            trueCount -= 1;
        }

        seed = pseudoRandom(seed);
        if (seed%100 >= 47){
            result.push(true);
            trueCount += 1;
        } else {
            result.push(false);
        }
    }

    return result;
}