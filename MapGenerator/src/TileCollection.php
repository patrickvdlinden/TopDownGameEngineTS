<?php
namespace MapGenerator;

use Exception;
use JsonSerializable;
use MapGenerator;
use stdClass;

class TileCollection implements JsonSerializable {
    /** @var stdClass */
    private $collection;

    public function __construct() {
        $this->collection = new stdClass();
    }

    public function add($y, $x, MapGenerator\Tile $tile) {
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