const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let input = [];

rl.on("line", function (line) {
  input.push(line);
}).on("close", function () {
  const [N, M] = input[0].split(" ").map(Number);
  let directionX = [0, 1, 0, -1]; // 북, 동, 남, 서
  let directionY = [-1, 0, 1, 0]; // 북, 동, 남, 서
  let answer = 1; // 청소한 칸의 개수

  const [startY, startX, direction] = input[1].split(" ").map(Number);
  let robotStatus = statusRobot(startX, startY, direction);
  const map = initMap(input, N);
  answer = move(robotStatus, map, answer);
  console.log(answer);
});

// 맵 세팅
function initMap(input, N) {
  const map = [];
  for (let i = 2; i <= N + 1; i++) {
    const line = input[i].split(" ").map(Number);
    map.push(line);
  }
  return map;
}

// 로봇 상태 지정
function statusRobot(row, col, direction) {
  return (robotStatus = {
    currentX: row, // 현재 x 축
    currentY: col, // 현재 y 축
    currentDirection: collectDirection(direction), // 현재 바라보는 방향
    gear: 0, // 0: 대기, 1: 정지
  });

  // 로봇이 바라보는 방향 설정
  function collectDirection(direction) {
    if (direction === 0) {
      return {
        direction: "N",
        directionX: 0,
        directionY: -1,
      };
    } else if (direction === 1) {
      return {
        direction: "E",
        directionX: 1,
        directionY: 0,
      };
    } else if (direction === 2) {
      return {
        direction: "S",
        directionX: 0,
        directionY: 1,
      };
    } else if (direction === 3) {
      return {
        direction: "W",
        directionX: -1,
        directionY: 0,
      };
    }
  }
}

// 로봇이 바라보는 방향 : 반시계 90도 회전
function rotationDirection(currentDirection) {
  if (currentDirection.direction === "N") {
    return {
      direction: "W",
      directionX: -1,
      directionY: 0,
    };
  } else if (currentDirection.direction === "E") {
    return {
      direction: "N",
      directionX: 0,
      directionY: -1,
    };
  } else if (currentDirection.direction === "S") {
    return {
      direction: "E",
      directionX: 1,
      directionY: 0,
    };
  } else if (currentDirection.direction === "W") {
    return {
      direction: "S",
      directionX: 0,
      directionY: 1,
    };
  }
}

function printMap(map) {
  console.log("-----------------------------");
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      process.stdout.write(map[i][j] + " ");
    }
    console.log();
  }
  console.log("-----------------------------");
}
function move(robotStatus, map, answer) {
  // 1. 현재 위치 청소
  map[robotStatus.currentY][robotStatus.currentX] = 2; // 청소한 곳은 2로 표시

  // 정지상태면 종료
  while (robotStatus.gear !== 1) {
    // 2. 현재 칸의 주변 4칸 중 청소되지 않은 빈 칸이 있는 경우
    // 2-1. 반시계 방향으로 90도 회전
    let unableToMoveCnt = 0; // 주변 4칸 모두 청소된 경우를 체크하기 위한 변수

    for (let dirCnt = 0; dirCnt < 4; dirCnt++) {
      let rotationDir = rotationDirection(robotStatus.currentDirection); // 바라보는 방향을 기준으로 반시계 방향으로 90도 회전 {direction: "W", directionX: -1, directionY: 0}

      // 2-2. 바라보는 방향을 기준으로 앞쪽 칸이 청소되지 않은 빈 칸인 경우
      const nextCol = robotStatus.currentY + rotationDir.directionY;
      const nextRow = robotStatus.currentX + rotationDir.directionX;

      if (map[nextCol][nextRow] === 0) {
        // 2-2. 한칸 전진
        robotStatus.currentY = nextCol;
        robotStatus.currentX = nextRow;
        robotStatus.currentDirection = rotationDir;

        // 2-3. 1번으로 돌아감
        map[nextCol][nextRow] = 2; // 청소한 곳은 2로 표시
        answer++;

        break;
      } else {
        robotStatus.currentDirection = rotationDir; // 로봇 현재 바라보는 방향 업데이트
      }
      unableToMoveCnt++;
    }
    if (unableToMoveCnt === 4) {
      // 3. 현재 칸의 주변 4칸 중 청소되지 않은 빈 칸이 없는 경우
      const nextCol =
        robotStatus.currentY - robotStatus.currentDirection.directionY;
      const nextRow =
        robotStatus.currentX - robotStatus.currentDirection.directionX;

      // 3-1. 바라보는 방향을 유지한 채로 한칸 후진할 수 있다면 후진
      if (map[nextCol][nextRow] !== 1) {
        robotStatus.currentY = nextCol;
        robotStatus.currentX = nextRow;
        unableToMoveCnt = 0; // 후진한 경우 다시 주변 4칸 탐색
      } else {
        // 3-2. 바라보는 방향을 유지한 채로 한칸 후진할 수 없다면 작동 멈춤
        robotStatus.gear = 1; // 정지
      }
    }
    // printMap(map);
  }
  return answer;
}
