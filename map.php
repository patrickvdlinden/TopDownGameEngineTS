<?php

abstract class TileDescriptor implements JsonSerializable {
    /** @var Tileset */
    public $tileset;

    /** @var string */
    public $name;

    /** @var string */
    public $label;

    /** @var bool */
    public $passable;

    /** @var string */
    public $type;

    protected function __construct($name, $label, $passable) {
        if (empty($name)) {
            throw new Exception("Name cannot be empty.");
        }

        if (empty($label)) {
            throw new Exception("Label cannot be empty.");
        }

        $this->name = $name;
        $this->label = $label;
        $this->passable = is_bool($passable) ? $passable : false;
    }

    public function jsonSerialize() {
        $result = [
            "name" => $this->name,
            "type" => $this->type,
            "label" => $this->label,
            "passable" => $this->passable,
        ];

        $this->onSerialize($result);

        return $result;
    }

    protected abstract function onSerialize(&$array);
}

class StaticTileDescriptor extends TileDescriptor {
    /** @var int */
    public $textureY;

    /** @var int */
    public $textureX;

    public $type = "static";

    public function __construct($name, $label, $passable, $textureY, $textureX) {
        parent::__construct($name, $label, $passable);

        $this->textureY = (int)$textureY;
        $this->textureX = (int)$textureX;
    }

    protected function onSerialize(&$array) {
        $array["textureX"] = $this->textureX;
        $array["textureY"] = $this->textureY;
    }
}

class AnimatedTileDescriptor extends TileDescriptor {
    /** @var array */
    public $animation;

    /** @var int */
    public $interval;

    public $type = "animated";

    public function __construct($name, $label, $passable, $textureIndice, $interval = null) {
        parent::__construct($name, $label, $passable);

        foreach ($textureIndice as $index => list($textureY, $textureX)) {
            $this->animation[] = ["textureY" => $textureY, "textureX" => $textureX];
        }

        $this->interval = $interval;
    }

    protected function onSerialize(&$array) {
        $array["animation"] = $this->animation;

        if ($this->interval > 0) {
            $array["interval"] = $this->interval;
        }
    }
}

class Tile implements JsonSerializable {
    /** @var string */
    public $tilesetName;

    /** @var string */
    public $tileName;

    public function __construct($tilesetName, $tileName) {
        $this->tilesetName = $tilesetName;
        $this->tileName = $tileName;
    }

    public function jsonSerialize() {
        return [
            "tilesetName" => $this->tilesetName,
            "tileName" => $this->tileName
        ];
    }
}

class Tileset implements JsonSerializable {
    /** @var string */
    public $name;

    /** @var string */
    public $textureFilePath;

    /** @var int */
    public $tileSize;

    /** @var TileDescriptor[] */
    private $tiles = [];

    /** @var string[] */
    private $animatedTiles = [];

    public function __construct($name, $textureFilePath, $tileSizeInPixels) {
        if (empty($name)) {
            throw new Exception("Name cannot be empty.");
        }

        if (empty($textureFilePath)) {
            throw new Exception("Please specify a path to the texture file.");
        }

        if (empty($tileSizeInPixels)) {
            throw new Exception("Tile size cannot be empty.");
        }

        $this->name = $name;
        $this->textureFilePath = $textureFilePath;
        $this->tileSize = $tileSizeInPixels;
    }

    public function describe(TileDescriptor $tile) {
        $tile->tileset = $this;

        $this->tiles[lcfirst($tile->name)] = $tile;

        if ($tile instanceof AnimatedTileDescriptor) {
            $this->animatedTiles[] = lcfirst($tile->name);
        }

        return $this;
    }

    public function jsonSerialize() {
        return [
            "name" => $this->name,
            "textureFilePath" => $this->textureFilePath,
            "tileSize" => $this->tileSize,
            "tiles" => $this->tiles,
            "animatedTiles" => $this->animatedTiles
        ];
    }
}

class TileCollection implements JsonSerializable {
    /** @var stdClass */
    private $collection;

    public function __construct() {
        $this->collection = new stdClass();
    }

    public function add($y, $x, Tile $tile) {
        if (!isset($this->collection->$y)) {
            $this->collection->$y = new stdClass();
        }

        if (isset($this->collection->$y->$x)) {
            throw new Exception("Duplicate key at y: $y, x: $x, tileName: {$tile->tileName}");
        }

        $this->collection->$y->$x = $tile;
    }

    public function jsonSerialize() {
        return $this->collection;
    }
}

abstract class Command implements JsonSerializable {
    /** @var string */
    public $name;

    public $args = [];

    protected function __construct($name) {
        $this->name = $name;
    }

    public function jsonSerialize() {
        return $this->name . (count($this->args) ? " " . join(" ", $this->args) : "");
    }
}

class TeleportCommand extends Command {
    public function __construct($y, $x) {
        parent::__construct("teleport");

        $this->args[] = "y:". (int)$y;
        $this->args[] = "x:". (int)$x;
    }
}

class Trigger implements JsonSerializable {
    /** @var number */
    public $y;

    /** @var number */
    public $x;

    /** @var number */
    public $width;

    /** @var number */
    public $height;

    /** @var string */
    public $name;

    /** @var string */
    public $command;

    public function __construct($name, $y, $x, $width, $height, Command $command) {
        $this->name = $name;
        $this->y = $y;
        $this->x = $x;
        $this->width = $width;
        $this->height = $height;
        $this->command = $command;
    }

    public function jsonSerialize() {
        return [
            "name" => $this->name,
            "y" => $this->y,
            "x" => $this->x,
            "width" => $this->width,
            "height" => $this->height,
            "command" => $this->command
        ];
    }
}

class Chunk implements JsonSerializable {
    /** @var int */
    private $size;

    /** @var TileCollection */
    private $tiles;

    /** @var Trigger[] */
    private $triggers = [];

    private $currentTileIndexY = 0;
    private $currentTileIndexX = 0;

    public function __construct($size = 16) {
        $this->size = $size;
        $this->tiles = new TileCollection();
    }

    public function addTile($y, $x, TileDescriptor $tileDescriptor) {
        if ($y >= $this->size || $x >= $this->size) {
            throw new Exception("Out of bounds: X and Y cannot be larger than the specified chunksize");
        }

        $this->tiles->add($y, $x, new Tile(lcfirst($tileDescriptor->tileset->name), lcfirst($tileDescriptor->name)));

        $this->currentTileIndexY = $y;
        $this->currentTileIndexX = $x + 1;
        
        if ($this->currentTileIndexX >= 16) {
            $this->currentTileIndexY++;
            $this->currentTileIndexX = 0;
        }

        return $this;
    }

    public function addTiles(array $tileDescriptors) {
        foreach ($tileDescriptors as $tileDescriptor) {
            $this->addTile($this->currentTileIndexY, $this->currentTileIndexX, $tileDescriptor);
        }

        return $this;
    }

    public function addTrigger(Trigger $trigger) {
        $this->triggers[] = $trigger;

        return $this;
    }

    public function jsonSerialize() {
        return [
            "tiles" => $this->tiles,
            "triggers" => $this->triggers
        ];
    }
}

class Map implements JsonSerializable {
    /** @var int */
    public $tileSize;

    /** @var int */
    public $chunkSize;

    /** @var stdClass */
    public $chunks;

    /** @var Tileset[] */
    private $tilesets = [];

    public function __construct($tileSizeInPixels, $chunkSizeInTiles) {
        $this->tileSize = $tileSizeInPixels;
        $this->chunkSize = $chunkSizeInTiles;
        $this->chunks = new stdClass();
    }

    public function addChunk($y, $x) {
        if (!isset($this->chunks->$y)) {
            $this->chunks->$y = new stdClass();
        }

        $chunk = new Chunk($this->chunkSize);
        $this->chunks->$y->$x = $chunk;

        return $chunk;
    }

    public function addTileset(Tileset $tileset) {
        $this->tilesets[lcfirst($tileset->name)] = $tileset;
    }

    public function getTilesets() {
        $result = [];

        foreach ($this->tilesets as $tileset) {
            $result[] = $tileset;
        }

        return $result;
    }

    public function jsonSerialize() {
        return [
            "tileSize" => $this->tileSize,
            "chunkSize" => $this->chunkSize,
            "chunks" => $this->chunks,
            "tilesets" => $this->tilesets
        ];
    }
}

$VOID = new StaticTileDescriptor("Void", "Void", true, 0, 0);
$WATER = new StaticTileDescriptor("Water", "Water (still)", false, 16, 0);
$WATER_A = new AnimatedTileDescriptor("WaterAnimated", "Water (animated)", false, [[16, 0], [16, 1], [16, 2], [16, 3], [16, 4], [16, 5], [16, 6], [16, 7], [16, 8], [16, 9], [16, 10], [16, 11], [16, 12], [16, 13], [16, 14], [16, 15], [16, 16], [16, 17], [16, 18], [16, 19], [16, 20], [16, 21], [16, 22], [16, 23], [16, 24], [17, 0], [17, 1], [17, 2], [17, 3], [17, 4], [17, 5], [17, 6]], 100);
$GRASS = new StaticTileDescriptor("Grass", "Grass", true, 0, 1);
$GRASS_TL = new StaticTileDescriptor("GrassTopLeft", "Grass (top left corner)", true, 1, 1);
$GRASS_TR = new StaticTileDescriptor("GrassTopRight", "Grass (top right corner)", true, 2, 1);
$GRASS_BR = new StaticTileDescriptor("GrassBottomRight", "Grass (bottom right corner)", true, 3, 1);
$GRASS_BL = new StaticTileDescriptor("GrassBottomLeft", "Grass (bottom left corner)", true, 4, 1);
$DIRT = new StaticTileDescriptor("Dirt", "Dirt", true, 0, 2);
$DIRT_TL = new StaticTileDescriptor("DirtTopLeft", "Dirt (top left corner)", true, 1, 2);
$DIRT_TR = new StaticTileDescriptor("DirtTopRight", "Dirt (top right corner)", true, 2, 2);
$DIRT_BL = new StaticTileDescriptor("DirtBottomRight", "Dirt (bottom right corner)", true, 3, 2);
$DIRT_BR = new StaticTileDescriptor("DirtBottomLeft", "Dirt (bottom left corner)", true, 4, 2);
$SAND = new StaticTileDescriptor("Sand", "Sand", true, 0, 3);
$SAND_TL = new StaticTileDescriptor("SandTopLeft", "Sand (top left corner)", true, 1, 3);
$SAND_TR = new StaticTileDescriptor("SandTopRight", "Sand (top right corner)", true, 2, 3);
$SAND_BR = new StaticTileDescriptor("SandBottomRight", "Sand (bottom right corner)", true, 3, 3);
$SAND_BL = new StaticTileDescriptor("SandBottomLeft", "Sand (bottom left corner)", true, 4, 3);
$WALL = new StaticTileDescriptor("Wall", "Wall", false, 0, 4);
$WALL_B = new StaticTileDescriptor("WallBottomGrass", "Wall bottom (grass)", false, 1, 4);
$DOOR_T = new StaticTileDescriptor("DoorTop", "Door (top)", false, 0, 5);
$DOOR = new StaticTileDescriptor("Door", "Door", true, 1, 5);

$tileset = new Tileset("BasicTiles", "BasicTiles.png", 32);
$tileset
    ->describe($VOID)
    ->describe($WATER)
    ->describe($WATER_A)
    ->describe($GRASS)
    ->describe($GRASS_TL)
    ->describe($GRASS_TR)
    ->describe($GRASS_BR)
    ->describe($GRASS_BL)
    ->describe($DIRT)
    ->describe($DIRT_TL)
    ->describe($DIRT_TR)
    ->describe($DIRT_BL)
    ->describe($DIRT_BR)
    ->describe($SAND)
    ->describe($SAND_TL)
    ->describe($SAND_TR)
    ->describe($SAND_BR)
    ->describe($SAND_BL)
    ->describe($WALL)
    ->describe($WALL_B)
    ->describe($DOOR_T)
    ->describe($DOOR);

$map = new Map(32, 16);
$map->addTileset($tileset);
$map->addChunk(0, 0)
    ->addTiles([
        $WALL,    $WALL,    $DOOR_T,  $WALL,    $WALL,    $WALL,    $WALL,    $WALL,    $WALL,    $WALL,    $WALL,    $WALL,    $WALL,    $WALL,    $WALL,    $WALL,
        $WALL_B,  $WALL_B,  $DOOR,    $WALL_B,  $WALL_B,  $WALL_B,  $WALL_B,  $WALL_B,  $WALL_B,  $WALL_B,  $WALL_B,  $WALL_B,  $WALL_B,  $WALL_B,  $WALL_B,  $WALL,
        $GRASS,   $GRASS,   $SAND,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $DIRT,
        $GRASS,   $GRASS,   $SAND,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $DIRT,
        $GRASS,   $GRASS,   $SAND,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $DIRT,
        $GRASS,   $GRASS,   $SAND,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $DIRT,
        $GRASS,   $GRASS,   $SAND,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $DIRT,
        $GRASS,   $GRASS,   $SAND,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $DIRT,
        $GRASS,   $GRASS,   $SAND,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $DIRT,
        $GRASS,   $GRASS,   $SAND,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $DIRT,
        $GRASS,   $GRASS,   $SAND,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $DIRT,
        $GRASS,   $GRASS,   $SAND,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $DIRT,
        $GRASS,   $GRASS,   $SAND,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $DIRT,
        $GRASS,   $GRASS,   $SAND,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $DIRT,
        $GRASS,   $GRASS,   $SAND,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $DIRT,
        $GRASS,   $GRASS,   $SAND,   $SAND,    $SAND,    $SAND,    $SAND,    $SAND,    $SAND,    $SAND,    $SAND,    $SAND,    $SAND,    $SAND,    $SAND,   $DIRT,
    ])
    ->addTrigger(new Trigger("Trigger1", 32, 64, 32, 32, new TeleportCommand(1165, 495)));

$map->addChunk(0, 1)
    ->addTiles([
        $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A,
        $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A,
        $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A,
        $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A,
        $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A,
        $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A,
        $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A,
        $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A,
        $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A,
        $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A,
        $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A,
        $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A,
        $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A,
        $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A,
        $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A, $WATER_A,
        $DIRT,    $DIRT,    $DIRT,    $DIRT,    $DIRT,    $DIRT,    $DIRT,    $DIRT,    $DIRT,    $DIRT,    $DIRT,    $DIRT,    $DIRT,    $DIRT,    $DIRT,    $DIRT,
    ]);

$map->addChunk(1, 0)
    ->addTiles([
        $GRASS,   $GRASS,   $SAND,    $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,
        $GRASS,   $GRASS,   $SAND,    $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,
        $GRASS,   $GRASS,   $SAND,    $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,
        $GRASS,   $GRASS,   $SAND,    $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,
        $GRASS,   $GRASS,   $SAND,    $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,
        $GRASS,   $GRASS,   $SAND,    $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,
        $GRASS,   $GRASS,   $SAND,    $SAND,    $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,
        $GRASS,   $GRASS,   $GRASS,   $SAND,    $SAND,    $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,
        $GRASS,   $GRASS,   $GRASS,   $GRASS,   $SAND,    $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,
        $GRASS,   $GRASS,   $GRASS,   $GRASS,   $SAND,    $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,
        $GRASS,   $GRASS,   $GRASS,   $GRASS,   $SAND,    $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,
        $GRASS,   $GRASS,   $GRASS,   $GRASS,   $SAND,    $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,
        $GRASS,   $GRASS,   $GRASS,   $GRASS,   $SAND,    $SAND,    $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,
        $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $SAND,    $SAND,    $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,
        $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $GRASS,   $SAND,    $SAND,    $SAND,    $SAND,    $SAND,    $SAND,    $SAND,    $SAND,    $SAND,    $SAND
    ]);

/*
echo json_encode($map, JSON_PRETTY_PRINT);exit;

$map = [
  "chunkSize" => 16, // in tiles
  "chunks" => [
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
  ]
];
*/

// Force loading time (test)

// Write tileset files
foreach ($map->getTilesets() as $tileset) {
    $tilesetFile = fopen($tileset->name .".tileset.json", "w");
    fwrite($tilesetFile, json_encode($tileset, JSON_PRETTY_PRINT));
    fclose($tilesetFile);
}

$fileExtension = "json";
$output = "";

sleep(2);

// TODO: Change to "format";
if (isset($_GET["includeVarName"])) {
    $fileExtension = "js";
    $output = "var map = ";
}

$output .= json_encode($map, JSON_PRETTY_PRINT);

$file = fopen("map.$fileExtension", "w");
fwrite($file, $output);
fclose($file);

switch ($fileExtension) {
    case "json":
        header("Content-Type: text/json");
        break;

    case "js":
        header("Content-Type: text/javascript");
        break;
}

echo $output;