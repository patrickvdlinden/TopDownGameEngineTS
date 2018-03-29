<?php
namespace MapGenerator;

use MapGenerator;

class AnimatedTileDescriptor extends MapGenerator\TileDescriptor {
    /** @var array */
    public $textureIndice;

    /** @var array */
    public $animation;

    /** @var int */
    public $interval;

    public $type = "animated";

    public function __construct($name, $label, $passable, $textureIndice, $interval = null) {
        parent::__construct($name, $label, $passable);

        $this->textureIndice = $textureIndice;
        foreach ($textureIndice as $index => list($textureY, $textureX)) {
            $this->animation[] = [
                "textureY" => $textureY,
                "textureX" => $textureX
            ];
        }

        $this->interval = $interval;
    }

    protected function onSerialize(&$array) {
        $array["animation"] = $this->animation;

        if ($this->interval > 0) {
            $array["interval"] = $this->interval;
        }
    }
}