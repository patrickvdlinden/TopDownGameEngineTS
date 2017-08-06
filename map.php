<?php
$WATER_IDX = ["animation" => [[16, 0], [16, 1], [16, 2], [16, 3], [16, 4], [16, 5], [16, 6], [16, 7], [16, 8], [16, 9], [16, 10], [16, 11], [16, 12], [16, 13], [16, 14], [16, 15], [16, 16], [16, 17], [16, 18], [16, 19], [16, 20], [16, 21], [16, 22], [16, 23], [16, 24], [17, 0], [17, 1], [17, 2], [17, 3], [17, 4], [17, 5], [17, 6]]];

$GRASS_IDX = [0, 0];
$GRASS_TL_IDX = [1, 0];
$GRASS_TR_IDX = [2, 0];
$GRASS_BR_IDX = [3, 0];
$GRASS_BL_IDX = [4, 0];

$DIRT_IDX = [0, 1];
$DIRT_TL_IDX = [1, 1];
$DIRT_TR_IDX = [2, 1];
$DIRT_BR_IDX = [3, 1];
$DIRT_BL_IDX = [4, 1];

$SAND_IDX = [0, 2];
$SAND_TL_IDX = [1, 2];
$SAND_TR_IDX = [2, 2];
$SAND_BR_IDX = [3, 2];
$SAND_BL_IDX = [4, 2];

$WALL_IDX = [1, 3];
$WALL_B_IDX = [0, 3];

$DOOR_IDX = [1, 4];
$DOOR_T_IDX = [0, 4];

$VOID_IDX = [15, 0];


$WATER = "water";
$GRASS = "grass";
$GRASS_TL = "grassTopLeft";
$GRASS_TR = "grassTopRight";
$GRASS_BR = "grassBottomRight";
$GRASS_BL = "grassBottomLeft";
$DIRT = "dirt";
$DIRT_TL = "dirtTopLeft";
$DIRT_TR = "dirtTopRight";
$DIRT_BR = "dirtBottomRight";
$DIRT_BL = "dirtBottomLeft";
$SAND = "sand";
$SAND_TL = "sandTopLeft";
$SAND_TR = "sandTopRight";
$SAND_BR = "sandBottomRight";
$SAND_BL =  "sandBottomLeft";
$WALL = "wall";
$WALL_B = "wallBottom";
$DOOR = "door";
$DOOR_T = "doorTop";
$VOID = "void";

$map = [
  "chunkSize" => 16, // in tiles
  "tileSize" => 32, // in pixels,
  "tiles" => [
    $WATER => $WATER_IDX,
    $GRASS => $GRASS_IDX,
    $GRASS_TL => $GRASS_TL_IDX,
    $GRASS_TR => $GRASS_TR_IDX,
    $GRASS_BR => $GRASS_BR_IDX,
    $GRASS_BL => $GRASS_BL_IDX,
    $DIRT => $DIRT_IDX,
    $DIRT_TR => $DIRT_TL_IDX,
    $DIRT_TR => $DIRT_TR_IDX,
    $DIRT_BR => $DIRT_BR_IDX,
    $DIRT_BL => $DIRT_BL_IDX,
    $SAND => $SAND_IDX,
    $SAND_TL => $SAND_TL_IDX,
    $SAND_TR => $SAND_TR_IDX,
    $SAND_BR => $SAND_BR_IDX,
    $SAND_BL => $SAND_BL_IDX,
    $WALL => $WALL_IDX,
    $WALL_B => $WALL_B_IDX,
    $DOOR => $DOOR_IDX,
    $DOOR_T => $DOOR_T_IDX,
    $VOID => $VOID_IDX
  ]
];
$map["chunks"] = [
  0 => [ //y
    0 => [ //x
      0 => [0 => $WALL, 1 => $WALL, 2 => $DOOR_T, 3 => $WALL, 4 => $WALL, 5 => $WALL, 6 => $WALL, 7 => $WALL, 8 => $WALL, 9 => $WALL, 10 => $WALL, 11 => $WALL, 12 => $WALL, 13 => $WALL, 14 => $WALL, 15 => $WALL],
      1 => [0 => $WALL_B, 1 => $WALL, 2 => $DOOR, 3 => $WALL, 4 => $WALL_B, 5 => $WALL_B, 6 => $WALL_B, 7 => $WALL_B, 8 => $WALL_B, 9 => $WALL_B, 10 => $WALL_B, 11 => $WALL_B, 12 => $WALL_B, 13 => $WALL_B, 14 => $WALL_B, 15 => $WALL],
      2 => [0 => $GRASS, 1 => $DIRT, 2 => $SAND, 3 => $DIRT, 4 => $GRASS, 5 => $GRASS, 6 => $GRASS, 7 => $GRASS, 8 => $GRASS, 9 => $GRASS, 10 => $GRASS, 11 => $GRASS, 12 => $GRASS, 13 => $GRASS, 14 => $GRASS, 15 => $DIRT],
      3 => [0 => $GRASS, 1 => $DIRT, 2 => $SAND, 3 => $DIRT, 4 => $GRASS, 5 => $GRASS, 6 => $GRASS, 7 => $GRASS, 8 => $GRASS, 9 => $GRASS, 10 => $GRASS, 11 => $GRASS, 12 => $GRASS, 13 => $GRASS, 14 => $GRASS, 15 => $DIRT],
      4 => [0 => $GRASS_TL, 1 => $DIRT, 2 => $SAND, 3 => $DIRT, 4 => $GRASS, 5 => $GRASS, 15 => $DIRT],
      5 => [0 => $DIRT, 1 => $DIRT_TL, 2 => $SAND, 3 => $DIRT, 4 => $GRASS, 5 => $GRASS, 7 => $VOID, 8 => $VOID, 9 => $VOID, 10 => $VOID, 11 => $VOID, 12 => $VOID, 13 => $VOID, 15 => $DIRT],
      6 => [0 => $DIRT, 1 => $SAND, 2 => $SAND_TL, 3 => $DIRT, 4 => $GRASS, 5 => $GRASS, 7 => $VOID, 8 => $VOID, 9 => $VOID, 10 => $VOID, 11 => $VOID, 12 => $VOID, 13 => $VOID, 15 => $DIRT],
      7 => [0 => $DIRT, 1 => $SAND, 2 => $DIRT, 3 => $DIRT_TL, 4 => $GRASS, 5 => $GRASS, 7 => $VOID, 8 => $VOID, 9 => $VOID, 10 => $VOID, 11 => $VOID, 12 => $VOID, 13 => $VOID, 15 => $DIRT],
      8 => [0 => $DIRT, 1 => $SAND, 2 => $DIRT, 3 => $GRASS, 4 => $GRASS, 5 => $GRASS, 7 => $VOID, 8 => $VOID, 9 => $VOID, 10 => $VOID, 11 => $VOID, 12 => $VOID, 13 => $VOID, 15 => $DIRT],
      9 => [0 => $DIRT, 1 => $SAND, 2 => $DIRT, 3 => $GRASS, 4 => $GRASS, 5 => $GRASS, 7 => $VOID, 8 => $VOID, 9 => $VOID, 10 => $VOID, 11 => $VOID, 12 => $VOID, 13 => $VOID, 15 => $DIRT],
      10 => [0 => $DIRT, 1 => $SAND, 2 => $DIRT, 3 => $GRASS, 4 => $GRASS, 5 => $GRASS, 7 => $VOID, 8 => $VOID, 9 => $VOID, 10 => $VOID, 11 => $VOID, 12 => $VOID, 13 => $VOID, 15 => $DIRT],
      11 => [0 => $DIRT, 1 => $SAND, 2 => $DIRT, 3 => $GRASS, 4 => $GRASS, 5 => $GRASS, 7 => $VOID, 8 => $VOID, 9 => $VOID, 10 => $VOID, 11 => $VOID, 12 => $VOID, 13 => $VOID, 15 => $DIRT],
      12 => [0 => $DIRT, 1 => $SAND, 2 => $DIRT, 3 => $GRASS, 4 => $GRASS, 5 => $GRASS, 7 => $VOID, 8 => $VOID, 9 => $VOID, 10 => $VOID, 11 => $VOID, 12 => $VOID, 13 => $VOID, 15 => $DIRT],
      13 => [0 => $DIRT, 1 => $SAND, 2 => $DIRT, 3 => $GRASS, 4 => $GRASS, 5 => $GRASS, 6 => $WALL, 7 => $WALL, 8 => $WALL, 9 => $WALL, 10 => $WALL, 11 => $WALL, 12 => $WALL, 13 => $WALL, 14 => $WALL, 15 => $DIRT],
      14 => [0 => $DIRT, 1 => $SAND, 2 => $DIRT, 3 => $GRASS, 4 => $GRASS, 5 => $GRASS, 6 => $WALL_B, 7 => $WALL_B, 8 => $WALL_B, 9 => $WALL_B, 10 => $WALL_B, 11 => $WALL_B, 12 => $WALL_B, 13 => $WALL_B, 14 => $WALL_B, 15 => $DIRT],
      15 => [0 => $DIRT, 1 => $SAND, 2 => $DIRT, 3 => $GRASS, 4 => $GRASS, 5 => $GRASS, 6 => $GRASS, 7 => $GRASS, 8 => $GRASS, 9 => $GRASS, 10 => $GRASS, 11 => $GRASS, 12 => $GRASS, 13 => $GRASS, 14 => $GRASS, 15 => $DIRT],
      "triggers" => [
        [ "x" => 64, "y" => 58, "width" => 32, "height" => 5, "command" => "teleport 1165 495" ]
      ]
    ],
    1 => [
      0 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      1 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      2 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      3 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      4 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      5 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      6 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      7 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      8 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      9 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      10 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      11 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      12 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      13 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      14 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      15 => [ 0 => $DIRT, 1 => $DIRT, 2 => $DIRT, 3 => $DIRT, 4 => $DIRT, 5 => $DIRT, 6 => $DIRT, 7 => $DIRT, 8 => $DIRT, 9 => $DIRT, 10 => $DIRT, 11 => $DIRT, 12 => $DIRT, 13 => $DIRT, 14 => $DIRT, 15 => $DIRT ]
    ],
    2 => [
      0 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      1 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      2 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      3 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      4 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      5 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      6 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      7 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      8 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      9 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      10 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      11 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      12 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      13 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      14 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      15 => [ 0 => $DIRT, 1 => $DIRT, 2 => $DIRT, 3 => $DIRT, 4 => $DIRT, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ]
    ]
  ],
  1 => [
    0 => [
      0 => [0 => $DIRT, 1 => $SAND, 2 => $DIRT, 3 => $GRASS, 4 => $GRASS, 5 => $GRASS, 6 => $GRASS, 7 => $GRASS, 8 => $GRASS, 9 => $GRASS, 10 => $GRASS, 11 => $GRASS, 12 => $GRASS, 13 => $GRASS, 14 => $GRASS, 15 => $GRASS],
      1 => [0 => $DIRT, 1 => $SAND, 2 => $DIRT, 3 => $GRASS, 4 => $GRASS, 5 => $GRASS, 6 => $GRASS, 7 => $GRASS, 8 => $GRASS, 9 => $GRASS, 10 => $GRASS, 11 => $GRASS, 12 => $GRASS, 13 => $GRASS, 14 => $GRASS, 15 => $GRASS],
      2 => [0 => $DIRT, 1 => $SAND, 2 => $DIRT, 3 => $GRASS, 4 => $GRASS, 5 => $GRASS, 6 => $GRASS, 7 => $GRASS, 8 => $GRASS, 9 => $GRASS, 10 => $GRASS, 11 => $GRASS, 12 => $GRASS, 13 => $GRASS, 14 => $GRASS, 15 => $GRASS],
      3 => [0 => $DIRT, 1 => $SAND, 2 => $DIRT, 3 => $GRASS, 4 => $GRASS, 5 => $GRASS, 6 => $GRASS, 7 => $GRASS, 8 => $GRASS, 9 => $GRASS, 10 => $GRASS, 11 => $GRASS, 12 => $GRASS, 13 => $GRASS, 14 => $GRASS, 15 => $GRASS],
      4 => [0 => $DIRT, 1 => $SAND, 2 => $DIRT, 3 => $DIRT, 4 => $DIRT, 5 => $DIRT, 6 => $DIRT, 7 => $DIRT, 8 => $DIRT, 9 => $DIRT, 10 => $GRASS, 11 => $GRASS, 12 => $GRASS, 13 => $GRASS, 14 => $GRASS, 15 => $GRASS ],
      5 => [0 => $DIRT, 1 => $SAND, 2 => $SAND, 3 => $SAND, 4 => $SAND, 5 => $SAND, 6 => $SAND, 7 => $SAND, 8 => $SAND, 9 => $DIRT, 10 => $GRASS, 11 => $GRASS, 12 => $GRASS, 13 => $GRASS, 14 => $GRASS, 15 => $GRASS ],
      6 => [0 => $DIRT, 1 => $DIRT, 2 => $DIRT, 3 => $DIRT, 4 => $DIRT, 5 => $DIRT, 6 => $DIRT, 7 => $DIRT, 8 => $SAND, 9 => $DIRT, 10 => $GRASS, 11 => $GRASS, 12 => $GRASS, 13 => $GRASS, 14 => $GRASS, 15 => $GRASS ],
      7 => [0 => $GRASS],
      8 => [0 => $GRASS],
      9 => [0 => $GRASS],
      10 => [0 => $GRASS],
      11 => [0 => $GRASS],
      12 => [0 => $GRASS],
      13 => [0 => $GRASS],
      14 => [0 => $GRASS],
      15 => [0 => $GRASS]
    ],
    1 => [
      0 => [ 0 => $WALL, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      1 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      2 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      3 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      4 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      5 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      6 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      7 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      8 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      9 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      10 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      11 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      12 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      13 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      14 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      15 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ]
    ],
    2 => [
      0 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      1 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      2 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      3 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      4 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      5 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      6 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      7 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      8 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      9 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      10 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      11 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      12 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      13 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      14 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ],
      15 => [ 0 => $WATER, 1 => $WATER, 2 => $WATER, 3 => $WATER, 4 => $WATER, 5 => $WATER, 6 => $WATER, 7 => $WATER, 8 => $WATER, 9 => $WATER, 10 => $WATER, 11 => $WATER, 12 => $WATER, 13 => $WATER, 14 => $WATER, 15 => $WATER ]
    ]
  ]
];

if (isset($_GET["includeVarName"])) {
  echo "var map = ";
}
echo json_encode($map, JSON_PRETTY_PRINT);