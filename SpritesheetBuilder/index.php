<!DOCTYPE html>

<html>
<head>
    <title>SpritesheetBuilder</title>

    <link rel="stylesheet" href="script/color-picker.min.css?v=<?= filemtime("script/color-picker.min.css"); ?>" type="text/css" />
    <style type="text/css">
        html, body {
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: "Segoe UI", sans-serif, serif;
            font-size: 12px;
        }

        .toolbarMenuContainer {
            height: 25px;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
        }

        .toolbarMenu {
            height: 25px;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #eee;
            margin: 0;
            padding: 0;
            list-style: none;
            font-family: Arial;
            font-size: 14px;
        }
        .toolbarMenu__item {
            height: 25px;
            padding: 0 10px;
            line-height: 25px;
            display: block;
            float: left;
            cursor: pointer;
        }
        .toolbarMenu__item:hover {
            background-color: #ddd;
        }

        .paneContainer {
            position: absolute;
            top: 25px;
            left: 0;
            right: 0;
            bottom: 0;
        }

        .pane {
            box-sizing: border-box;
            border: 1px solid #ccc;
        }

        .pane--docked {
            position: absolute;
        }

        .pane--docked.pane--left {
            left: 0;
        }

        .pane--docked.pane--right {
            right: 0;
        }

        .pane--docked.pane--top {
            top: 0;
        }

        .pane--docked.pane--bottom {
            bottom: 0;
        }

        .pane--left,
        .pane--right {
            width: 300px;
        }

        .pane--center {
            width: calc(100% - 600px);
            left: 300px;
        }

        .pane__title {
            height: 19px;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            padding: 5px;
            margin: 0;
            background-color: #fafafa;
            border-bottom: 1px solid #ccc;
            font-size: 14px;
            font-weight: normal;
            overflow: hidden;
        }

        .pane__body {
            position: absolute;
            top: 30px;
            left: 0;
            right: 0;
            bottom: 0;
        }

        #editorPane {
            background-color: #eee;
        }

        .texturesList {
            margin: 0;
            padding: 0;
            list-style: none;
        }

        .texturesList__item {
            margin: 5px;
            display: inline-block;
            cursor: pointer;
        }

        .texturesList__itemThumbnail {
            width: 150px;
            height: 150px;
            background: #fff;
            border: 1px solid #aaa;
        }
        .texturesList__itemThumbnail img {
            max-width: 100%;
            margin: 0;
            padding: 0;
        }

        .texturesList__itemLabel {
            width: 140px;
            padding: 5px;
            border: 1px solid transparent;
            border-top: none;
            text-align: center;
            font-size: 12px;
            display: block;
        }

        .texturesList__item:hover .texturesList__itemThumbnail,
        .texturesList__item.texturesList__item--active .texturesList__itemThumbnail {
            border-color: #000;
        }

        .texturesList__item:hover .texturesList__itemLabel,
        .texturesList__item.texturesList__item--active .texturesList__itemLabel {
            background-color: rgba(0, 0, 0, 0.3);
            border-color: #000;
        }

        .properties {
            font-size: 12px;
        }

        .properties__row {
            padding: 2px 5px;
        }

        .properties__label {
            width: 150px;
            display: inline-block;
        }

        .properties__field {
            width: 125px;
            display: inline-block;
        }
        .properties__field input,
        .properties__field select,
        .properties__field textarea {
            max-width: 125px;
        }        
        .properties__field--number input {
            /*width: 50px;*/
        }

        .texturesCanvas {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            image-rendering: optimizeSpeed;             /* Older versions of FF          */
            image-rendering: -moz-crisp-edges;          /* FF 6.0+                       */
            image-rendering: -webkit-optimize-contrast; /* Safari                        */
            image-rendering: -o-crisp-edges;            /* OS X & Windows Opera (12.02+) */
            image-rendering: pixelated;                 /* Awesome future-browsers       */
            -ms-interpolation-mode: nearest-neighbor;   /* IE                            */
        }
    </style>

    <script type="text/javascript">
        <?php if (isset($_GET["debug"]) && $_GET["debug"]) : ?>
            window.debug = true;
        <?php endif; ?>

        window.availableSpritesheetTextures = [];
        <?php
            if ($handle = opendir("Resources/Textures")) {
                while (($entry = readdir($handle)) !== false) {
                    if ($entry !== "." && $entry !== "..") {
                        echo "window.availableSpritesheetTextures.push(\"". basename($entry) ."\");\r\n";
                    }
                }
                closedir($handle);
            }
        ?>
    </script>
    <script type="text/javascript" src="script/color-picker.min.js?v=<?= filemtime("script/color-picker.min.js"); ?>"></script>
    <script type="text/javascript" src="script/core.js?v=<?= filemtime("script/core.js"); ?>"></script>
</head>
<body>
    <div class="toolbarMenuContainer">
        <ul class="toolbarMenu">
            <li class="toolbarMenu__item">File</li>
            <li class="toolbarMenu__item">Edit</li>
            <li class="toolbarMenu__item">View</li>
            <li class="toolbarMenu__item">Help</li>
        </ul>
    </div>
    <div class="paneContainer">
        <div class="pane pane--docked pane--left pane--top pane--bottom pane--width25p" id="leftPane">
            <h3 class="pane__title">Left Pane</h3>
            <div class="pane__body"></div>
        </div>
        <div class="pane pane--docked pane--center pane--top pane--bottom pane--offset25p pane--width50pMinus300" id="editorPane">
            <h3 class="pane__title">Editor Pane</h3>
            <div class="pane__body"></div>
        </div>
        <div class="pane pane--docked pane--right pane--top pane--bottom pane--width300" id="propertiesPane">
            <h3 class="pane__title">Properties Pane</h3>
            <div class="pane__body"></div>
        </div>
    </div>
</body>
</html>