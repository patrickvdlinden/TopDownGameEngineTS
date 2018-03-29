<?php
namespace MapGenerator;

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