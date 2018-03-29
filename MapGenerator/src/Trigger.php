<?php
namespace MapGenerator;

use JsonSerializable;
use MapGenerator;

class Trigger implements JsonSerializable {
    /** @var number */
    public $y;

    /** @var number */
    public $x;

    /** @var number */
    public $width;

    /** @var number */
    public $height;

    /** @var string */
    public $name;

    /** @var string */
    public $command;

    public function __construct($name, $y, $x, $width, $height, MapGenerator\Command $command) {
        $this->name = $name;
        $this->y = $y;
        $this->x = $x;
        $this->width = $width;
        $this->height = $height;
        $this->command = $command;
    }

    public function jsonSerialize() {
        return [
            "name" => $this->name,
            "y" => $this->y,
            "x" => $this->x,
            "width" => $this->width,
            "height" => $this->height,
            "command" => $this->command
        ];
    }
}