<?php
namespace MapGenerator;

use MapGenerator;

class TeleportCommand extends MapGenerator\Command {
    public function __construct($y, $x) {
        parent::__construct("teleport");

        $this->args[] = "y:" . (int)$y;
        $this->args[] = "x:" . (int)$x;
    }
}