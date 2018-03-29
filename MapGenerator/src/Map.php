<?php
namespace MapGenerator;

use JsonSerializable;
use MapGenerator;
use stdClass;

class Map implements JsonSerializable {
    /** @var int */
    public $tileSize;

    /** @var int */
    public $chunkSize;

    /** @var stdClass */
    public $chunks;

    /** @var \MapGenerator\Tileset[] */
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

        $chunk = new MapGenerator\Chunk($this->chunkSize);
        $this->chunks->$y->$x = $chunk;

        return $chunk;
    }

    public function addTileset(MapGenerator\Tileset $tileset) {
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