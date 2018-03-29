<?php
namespace MapGenerator;

use JsonSerializable;

abstract class Command implements JsonSerializable {
    /** @var string */
    public $name;

    public $args = [];

    protected function __construct($name) {
        $this->name = $name;
    }

    public function jsonSerialize() {
        return $this->name . (count($this->args) ? " " . join(" ", $this->args) : "");
    }
}