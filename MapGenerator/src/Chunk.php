<?php
namespace MapGenerator;

use Exception;
use JsonSerializable;

class Chunk implements JsonSerializable {
    /** @var int */
    private $size;

    /** @var \MapGenerator\TileCollection */
    private $tiles;

    private $objects;

    /** @var \MapGenerator\Trigger[] */
    private $triggers = [];

    private $currentTileIndexY = 0;
    private $currentTileIndexX = 0;

    public function __construct($size = 16) {
        $this->size = $size;
        $this->tiles = new TileCollection();
        $this->objects = new ObjectCollection();
    }

    public function addTile($y, $x, TileDescriptor $tileDescriptor) {
        if ($y >= $this->size || $x >= $this->size) {
            throw new Exception("Out of bounds: X and Y cannot be larger than the specified chunksize");
        }

        $this->tiles->add($y, $x, new Tile(lcfirst($tileDescriptor->tileset->name), lcfirst($tileDescriptor->name), $tileDescriptor->passable));

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

    /**
     * @param $y
     * @param $x
     * @param ObjectDescriptor $objectDescriptor
     * @return $this
     * @throws Exception
     */
    public function addObject($y, $x, ObjectDescriptor $objectDescriptor) {
        if ($y >= $this->size || $x >= $this->size) {
            throw new Exception("Out of bounds: X and Y cannot be larger than the specified chunksize");
        }

        $this->objects->add($y, $x, new StaticObject(lcfirst($objectDescriptor->tileset->name), lcfirst($objectDescriptor->name)));

        return $this;
    }

    public function addObjects(array $objects) {
        foreach ($objects as $object) {
            $this->addObject($object[0], $object[1], $object[2]);
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
            "objects" => $this->objects,
            "triggers" => $this->triggers
        ];
    }
}