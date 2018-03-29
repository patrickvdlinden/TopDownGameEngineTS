<?php
namespace MapGenerator;

use Exception;
use JsonSerializable;
use stdClass;

class ObjectCollection implements JsonSerializable {
    /** @var stdClass */
    private $collection;

    public function __construct() {
        $this->collection = new stdClass();
    }

    public function add($y, $x, StaticObject $object) {
        if (!isset($this->collection->$y)) {
            $this->collection->$y = new stdClass();
        }

        if (isset($this->collection->$y->$x)) {
            throw new Exception("Duplicate key at y: $y, x: $x, objectName: {$object->name}");
        }

        $this->collection->$y->$x = $object;
    }

    public function jsonSerialize() {
        return $this->collection;
    }
}