import { Button, Grid } from "@mui/material";
import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import Cell from "../pages/components/Cell";
import useInterval from "../hooks/useInterval";

const Home: NextPage = () => {
  const size = useWindowSize();
  const data = numberOfCasesPerWidth(size);
  const array = createArray(data);
  const containerRef = useRef(null);

  const [shouldShow, setState] = useState(true);
  const [isRunning, setRunning] = useState(false);

  useEffect(() => {
    //randomState();
  }, [containerRef.current]);

  function getNextState(cellToChange: any) {
    const cell = cellToChange;
    const cellX = cell.dataset.x;
    const cellY = cell.dataset.y;

    const container: any = containerRef.current;
    const childNodes = container.childNodes;

    let aliveNeighboors = 0;

    Array.from(childNodes).forEach((el: any) => {
      if (
        el.dataset.x <= Number(cellX) + 1 &&
        el.dataset.x >= Number(cellX) - 1 &&
        el.dataset.y <= Number(cellY) + 1 &&
        el.dataset.y >= Number(cellY) - 1 &&
        el != cell
      ) {
        if (el.dataset.state == "alive") {
          aliveNeighboors++;
        }
      }
    });

    if (cell.dataset.state == "alive") {
      if (aliveNeighboors < 2) {
        cell.dataset.nextState = "dead";
      } else if (aliveNeighboors >= 2 && aliveNeighboors <= 3) {
        cell.dataset.nextState = "alive";
      } else {
        cell.dataset.nextState = "dead"; //to be changed
      }
    } else {
      if (aliveNeighboors == 3) {
        cell.dataset.nextState = "alive";
      } else {
        cell.dataset.nextState = "dead"; //to be changed
      }
    }
  }

  useInterval(async () => {
    if (isRunning) {
      await setNextState();
      await nextState();
    }
  }, 500);

  function nextState() {
    setState(false);
    if (containerRef.current != null) {
      const container: any = containerRef.current;
      const childNodes = container.childNodes;
      const childNodesAsArray: any[] = Array.from(childNodes);
      childNodesAsArray.forEach((el) => {
        getNextState(el);
      });
    }

    setState(true);
  }

  function setNextState() {
    if (containerRef.current != null) {
      const container: any = containerRef.current;
      const childNodes = container.childNodes;
      const childNodesAsArray: any[] = Array.from(childNodes);
      childNodesAsArray.forEach((el) => {
        el.dataset.state = el.dataset.nextState;
      });
    }
  }

  function handleClick(event: any) {
    const cell = event.target;
    if (cell.dataset.state == "alive") {
      cell.dataset.state = "dead";
    } else {
      cell.dataset.state = "alive";
    }
  }

  return (
    <div>
      <div style={{ margin: "10px" }}>
        <Button
          variant="contained"
          onClick={() => {
            setRunning(true);
          }}
        >
          {" "}
          Start Game{" "}
        </Button>
        <Button
          onClick={() => {
            setRunning(false);
          }}
        >
          {" "}
          Stop Game{" "}
        </Button>
      </div>
      {shouldShow ? (
        <Grid container spacing={2} sx={{ margin: "10px" }} ref={containerRef}>
          {array.map((cell) => (
            <Cell
              key={`${cell.x}, ${cell.y}`}
              x={cell.x}
              y={cell.y}
              onPress={handleClick}
            />
          ))}
        </Grid>
      ) : (
        <p> Fuck off</p>
      )}
    </div>
  );
};

export default Home;

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
      window.addEventListener("resize", handleResize);

      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);
  return windowSize;
}

function numberOfCasesPerWidth(size: any) {
  let numberOfBoxPerRow = Math.round(size.width / 50);
  let numberOfRow = Math.round((size.height - 10) / 50);

  let data = {
    numberPerRow: 0,
    numberOfRow: 0,
    numberOfCells: 0,
  };

  if (numberOfBoxPerRow > 0 && numberOfRow > 0) {
    data = {
      numberPerRow: numberOfBoxPerRow,
      numberOfRow: numberOfRow,
      numberOfCells: numberOfBoxPerRow * numberOfRow,
    };
    return data;
  }

  return data;
}

function createArray(data: any) {
  const array: any[] = [];

  let x = 0;
  let y = 1;
  for (let i = 0; i < data.numberOfCells; i++) {
    if (x < data.numberPerRow) {
      x = x + 1;
    } else {
      x = 1;
      y = y + 1;
    }

    let cell = {
      x: x,
      y: y,
    };

    array.push(cell);
  }

  return array;
}
