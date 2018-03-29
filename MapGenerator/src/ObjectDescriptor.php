<?php
namespace MapGenerator;

use Exception;
use JsonSerializable;

abstract class ObjectDescriptor implements JsonSerializable {
    /** @var Tileset */
    public $tileset;

    /** @var string */
    public $name;

    /** @var string */
    public $label;

    /** @var string */
    public $type;

    protected function __construct($name, $label) {
        if (empty($name)) {
            throw new Exception("Name cannot be empty.");
        }

        if (empty($label)) {
            throw new Exception("Label cannot be empty.");
        }

        $this->name = $name;
        $this->label = $label;
    }

    public function jsonSerialize() {
        $result = [
            "name" => $this->name,
            "type" => $this->type,
            "label" => $this->label
        ];

        $this->onSerialize($result);

        return $result;
    }

    protected abstract function onSerialize(&$array);
}