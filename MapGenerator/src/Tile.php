<?php
namespace MapGenerator;

use JsonSerializable;

class Tile implements JsonSerializable {
    /** @var string */
    public $tilesetName;

    /** @var string */
    public $tileName;

    /** @var boolean */
    public $passable;

    public function __construct($tilesetName, $tileName, $passable) {
        $this->tilesetName = $tilesetName;
        $this->tileName = $tileName;
        $this->passable = is_bool($passable) ? $passable : false;
    }

    public function jsonSerialize() {
        return [
            "tilesetName" => $this->tilesetName,
            "tileName" => $this->tileName,
            "passable" => $this->passable,
        ];
    }
}