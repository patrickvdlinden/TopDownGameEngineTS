<?php
namespace MapGenerator;

use Exception;
use JsonSerializable;

class Tileset implements JsonSerializable {
    /** @var string */
    public $name;

    /** @var string */
    public $textureFilePath;

    /** @var int */
    public $tileSize;

    /** @var \MapGenerator\TileDescriptor[] */
    private $tiles = [];

    /** @var \MapGenerator\ObjectDescriptor[] */
    private $objects = [];

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

    public function describeTile(TileDescriptor $tile) {
        $tile->tileset = $this;

        $this->tiles[lcfirst($tile->name)] = $tile;

        if ($tile instanceof AnimatedTileDescriptor) {
            $this->animatedTiles[] = lcfirst($tile->name);
        }

        return $this;
    }

    public function describeObject(ObjectDescriptor $object) {
        $object->tileset = $this;

        $this->objects[lcfirst($object->name)] = $object;

        return $this;
    }

    public function jsonSerialize() {
        return [
            "name" => $this->name,
            "textureFilePath" => $this->textureFilePath,
            "tileSize" => $this->tileSize,
            "tiles" => $this->tiles,
            "objects" => $this->objects,
            "animatedTiles" => $this->animatedTiles
        ];
    }
}