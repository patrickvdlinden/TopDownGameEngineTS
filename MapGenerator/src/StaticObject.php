<?php
namespace MapGenerator;

use JsonSerializable;

class StaticObject implements JsonSerializable {
    /** @var string */
    public $tilesetName;

    /** @var string */
    public $objectName;

    public function __construct($tilesetName, $objectName) {
        $this->tilesetName = $tilesetName;
        $this->objectName = $objectName;
    }

    public function jsonSerialize() {
        return [
            "tilesetName" => $this->tilesetName,
            "objectName" => $this->objectName
        ];
    }
}