class Maze {
    constructor(seed){
        this.dict = {};

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

                this.dict[key] = [[north, south, east, west], [false, false, false, false], "None"];
            }
        }

        for (let i = 1; i <= 8; i++){
            for (let j = 1; j <= 8; j++){
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

        let unexplored = JSON.parse(JSON.stringify(this.dict));

        for (let key in unexplored) {
            if (unexplored[key][1][0] && unexplored[key][1][1] && unexplored[key][1][2] && unexplored[key][1][3]){
                console.log(key + ": split a four way")
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
                delete unexplored[key];
            } else if (!unexplored[key][1][0] && !unexplored[key][1][1] && !unexplored[key][1][2] && !unexplored[key][1][3]){
                delete unexplored[key];
                console.log(key + ": ignored an empty")
            }
        }

        console.log(unexplored);

        let components = exploreMaze(unexplored);

        console.log(components);

        //connect them???

        //place important locations
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

        console.log("started a component at: " + key);
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

