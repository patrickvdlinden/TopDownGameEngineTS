<?php
namespace MapGenerator;

use Exception;
use JsonSerializable;

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