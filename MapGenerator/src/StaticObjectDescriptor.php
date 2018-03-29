<?php
namespace MapGenerator;

class StaticObjectDescriptor extends ObjectDescriptor {
    /** @var int */
    public $textureY;

    /** @var int */
    public $textureX;

    /** @var int */
    public $textureWidth;

    /** @var int */
    public $textureHeight;

    /** @var int */
    public $collisionY;

    /** @var int */
    public $collisionX;

    /** @var int */
    public $collisionWidth;

    /** @var int */
    public $collisionHeight;

    public $type = "static";

    public function __construct($name, $label, $textureY, $textureX, $textureWidth, $textureHeight, $collisionY, $collisionX, $collisionWidth, $collisionHeight) {
        parent::__construct($name, $label);

        $this->textureY = (int)$textureY;
        $this->textureX = (int)$textureX;
        $this->textureWidth = (int)$textureWidth;
        $this->textureHeight = (int)$textureHeight;
        $this->collisionY = (int)$collisionY;
        $this->collisionX = (int)$collisionX;
        $this->collisionWidth = (int)$collisionWidth;
        $this->collisionHeight = (int)$collisionHeight;
    }

    protected function onSerialize(&$array) {
        $array["textureX"] = $this->textureX;
        $array["textureY"] = $this->textureY;
        $array["textureWidth"] = $this->textureWidth;
        $array["textureHeight"] = $this->textureHeight;
        $array["collisionX"] = $this->collisionX;
        $array["collisionY"] = $this->collisionY;
        $array["collisionWidth"] = $this->collisionWidth;
        $array["collisionHeight"] = $this->collisionHeight;
    }
}