// Inspired by the works of Andy Warhol
// Made to explore color theory and grid art through the tweaking of small parameters

function setup() {
  createCanvas(500, 500);
  colorMode(HSB, 360, 100, 100, 100);
  background(0, 0, 100, 0);
  rectMode(CORNER);
  ellipseMode(CENTER);

  // Optional Stroke
  strokeWeight(2);
  stroke(0, 0, 0);
  noStroke();

  // Set to...
  // 1 = Complementary, 2 = Analogous, 3 = Triadic, 4 = Custom
  let colorScheme = 3;

  // Choose hue...between 0 and 360
  let selectedHue = 320;

  // Edit these to select your hues if you chose a custom color scheme
  let secondCustomHue = 0, thirdCustomHue = 0;

  // Creates color palette based on the hue you chose!
  let huePalette = [selectedHue];

  colorHuesAndScheme(colorScheme, selectedHue, huePalette, secondCustomHue, thirdCustomHue);

  // Set size of grid by changing the number of rows and columns
  let numRowsAndCols = 4, rectWidth = width / numRowsAndCols, rectHeight = height / numRowsAndCols;

  // Choose the shapes you want...
  // 1 = Circles, 2 = Triangles, 3 = Custom Shape, 4 = Blank Space, 5 = String, 6 = Custom Image
  // Assign values in the order that you want them...
  let shapesWanted = [3, 0, 0, 0, 0];

  // Choose a string if you want and change the boolean to true
  let textToDisplay = "";
  let usingString = false;

  // If you want to include a photo, provide a valid image URL and change boolean
  let usingPhoto = false;

  makeGrid(numRowsAndCols, rectWidth, rectHeight, huePalette, shapesWanted, colorScheme, textToDisplay, usingString, usingPhoto);
}

function makeGrid(numRowsAndCols, rectWidth, rectHeight, huePalette, shapesWanted, colorScheme, text, usingString, usingPhoto) {
  //Initializes string index which is independent of rows and columns
  stringIndex = 0;

  for (row = 0; row < numRowsAndCols; row++) {
    let count;

    if (row % 2 == 0) {
      count = 1;
    } else {
      count = 2;
    }

    for (col = 0; col < numRowsAndCols; col++) {
      if (count % 2 != 0) {
        fill(huePalette[0], 100, 100, 100);
      } else {
        fill(huePalette[1], 100, 100, 100);
      }
      rect(col*(rectWidth), row*(rectHeight), rectWidth, rectHeight);

      count++;
    }

    shapesIndex = 0;

    //Following if statement allows for every row to start with a different shape
    if (row % 2 != 0) {
      shapesIndex = 1;
    }

    for (col = 0; col < numRowsAndCols; col++) {
      assignColor(colorScheme, huePalette, row, col);

      if (shapesWanted[shapesIndex] == 1) {
        //First ellipse method call makes a shadow
        fill(0, 0, 0, 20);
        ellipse((col + 0.60)*(rectWidth), (row + 0.50)*(rectHeight), rectWidth/2, rectHeight/2);
        assignColor(colorScheme, huePalette, row, col);

        ellipse((col+0.5)*(rectWidth), (row+0.5)*(rectHeight), rectWidth/2, rectHeight/2);
      } else if (shapesWanted[shapesIndex] == 2) {
        //Creates a triangle

        X1Coordinate = (col + 0.1)*(rectWidth), Y1Coordinate = (row)*(rectHeight) + rectHeight;
        X2Coordinate = (col)*(rectWidth) + (rectWidth/2), Y2Coordinate = (row + 0.1)*(rectHeight);
        X3Coordinate = (col - 0.1)*(rectWidth) + (rectWidth), Y3Coordinate = (row)*(rectHeight) + rectHeight;

        Y1Shadow = (-0.01)*rectHeight;
        X2Shadow = (0.1)*rectWidth;
        X3Shadow = (0.05)*rectWidth;

        //Shadow for triangle
        fill(0, 0, 0, 50);
        triangle(X1Coordinate, Y1Coordinate + Y1Shadow, X2Coordinate + X2Shadow, Y2Coordinate, X3Coordinate + X3Shadow, Y3Coordinate);

        //Actual triangle
        assignColor(colorScheme, huePalette, row, col);
        triangle(X1Coordinate, Y1Coordinate, X2Coordinate, Y2Coordinate, X3Coordinate, Y3Coordinate);
      } else if (shapesWanted[shapesIndex] == 3) {
        numVertexes = 300;
        beginShape();
        for (i = 0; i < numVertexes; i++) {
          assignColor(colorScheme, huePalette, row, col);
          vertex(random(col*rectWidth, (col+1)*rectWidth), random(row*rectHeight, (row+1)*rectHeight));
        }
        endShape();
      } else if (usingString == true && shapesWanted[shapesIndex] == 5) {
        //Uses .charAt() to traverse string and puts individual letters in squares

        if (stringIndex < text.length()) {
          font = createFont("Arial Bold", 64);
          textFont(font);

          while (col < numRowsAndCols) {
            assignColor(colorScheme, huePalette, row, col);

            pushMatrix();
            translate((rectWidth/2) + ((rectWidth)*col), (rectHeight/1.5) + ((rectHeight)*row));
            textAlign(CENTER);
            rotate(radians(random(-50, 50)));
            textSize(rectHeight/2);
            text(text.charAt(stringIndex), 0, 0);
            popMatrix();

            if (stringIndex + 1 < text.length()) {
              stringIndex++;
            } else {
              stringIndex = 0;
              break;
            }

            col++;
          }
        }
      } else if (usingPhoto == true && shapesWanted[shapesIndex] == 6) {
        //Uses a custom image per square
        img;

        img = loadImage("");

        imageMode(CENTER);

        hueForTint = getTintHue(huePalette, colorScheme, row, col);
        tint(hueForTint, 90, 100);

        image(img, (rectWidth/2) + ((rectWidth)*col), (rectHeight/2) + ((rectHeight)*row), rectWidth/1.5, rectHeight/1.5);
      } else if (shapesWanted[shapesIndex] == 4) {
        //Does nothing for blank space
      } else if (shapesWanted[shapesIndex] == 0) {
        shapesIndex = -1;
        col-=1;
      }

      if (shapesIndex + 1 <= shapesWanted.length) {
        shapesIndex++;
      }

      //Resets shapesIndex to account for grid that's wider than number of shapes
      if (shapesIndex + 1 > shapesWanted.length) {
        shapesIndex = 0;
      }
    }
  }
}

function colorHuesAndScheme(schemeSelector, selectedHue, huePalette, secondHue, thirdHue) {
  if (schemeSelector == 1) {
    compliment = (selectedHue + 180) % 360;
    huePalette[1] = compliment;
  } else if (schemeSelector == 2) {
    analogous1 = ((selectedHue + 30) % 360), analogous2 = (selectedHue - 30) % 360;

    huePalette[1] = analogous1;
    huePalette[2] = analogous2;
  } else if (schemeSelector == 3) {
    triadCompliment1 = (abs(selectedHue + 120) % 360), triadCompliment2 = abs(triadCompliment1 + 120) % 360;

    huePalette[1] = triadCompliment1;
    huePalette[2] = triadCompliment2;
  } else if (schemeSelector == 4) {
    huePalette[0] = selectedHue;
    huePalette[1] = secondHue;
    huePalette[2] = thirdHue;
  }
}

function assignColor(colorScheme, huePalette, row, col) {
  if ((colorScheme == 1) && (row % 2 == 0)) {
    if (col % 2 != 0) {
      fill(huePalette[0], 100, 100, 100);
    } else if (col % 2 == 0) {
      fill(huePalette[1], 100, 100, 100);
    }
  } else if ((colorScheme == 1) && (row % 2 != 0)) {
    if (col % 2 != 0) {
      fill(huePalette[1], 100, 100, 100);
    } else if (col % 2 == 0) {
      fill(huePalette[0], 100, 100, 100);
    }
  } else {
    fill(huePalette[2], 100, 100, 100);
  }
}

function getTintHue(huePalette, colorScheme, row, col) {
  if ((colorScheme == 1) && (row % 2 == 0)) {
    if (col % 2 != 0) {
      return huePalette[0];
    } else if (col % 2 == 0) {
      return huePalette[1];
    }
  }  

  if ((colorScheme == 1) && (row % 2 != 0)) {
    if (col % 2 != 0) {
      return huePalette[1];
    } else if (col % 2 == 0) {
      return huePalette[0];
    }
  } 

  return huePalette[2];
}
