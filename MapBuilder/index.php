<!DOCTYPE html>

<html>
<head>
    <title>SpritesheetBuilder</title>

    <link rel="stylesheet" href="../node_modules/c-p/color-picker.min.css?v=<?= filemtime("../node_modules/c-p/color-picker.min.css"); ?>" type="text/css" />
    <style type="text/css">
        html, body {
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: "Segoe UI", sans-serif, serif;
            font-size: 12px;
        }

        .appContainer {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }

        .appContainer.appContainer--hasToolbarMenu > .pane {
            margin-top: 25px;
        }

        .control {
            position: relative;
            box-sizing: border-box;
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
            z-index: 1000;
        }
        .toolbarMenu__item {
            position: relative;
            display: block;
            float: left;
        }
        
        .toolbarMenu__item > .toolbarMenu__itemLabel {
            height: 25px;
            padding: 0 10px;
            line-height: 25px;
            display: inline-block;
            cursor: pointer;
        }
        .toolbarMenu__item > .toolbarMenu__itemLabel:hover,
        .toolbarMenu__item.toolbarMenu__item--opened > .toolbarMenu__itemLabel {
            background-color: #ddd;
        }

        .toolbarMenu__itemShortKeys {
            position: absolute;
            right: 20px;
        }

        .toolbarMenu__subMenu {
            min-width: 200px;
            position: absolute;
            margin: 0;
            padding: 4px 0;
            border: 1px solid #ccc;
            background-color: #fff;
            box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3);
            list-style: none;
            display: none;
        }
        .toolbarMenu__item.toolbarMenu__item--opened > .toolbarMenu__subMenu {
            display: block;
        }

        .toolbarMenu__subMenu .toolbarMenu__itemLabel {
            position: relative;
            padding-left: 20px;
        }

        .toolbarMenu__subMenu .toolbarMenu__item,
        .toolbarMenu__subMenu .toolbarMenu__itemLabel  {
            display: block;
            float: none;
        }

        .toolbarMenu__item--divider {
            margin: 4px 0;
            height: auto;
        }

        .toolbarMenu__item.toolbarMenu__item--divider .toolbarMenu__itemLabel,
        .toolbarMenu__item.toolbarMenu__item--divider .toolbarMenu__itemLabel:hover {
            height: 1px;
            background-color: #e3e3e3;
            cursor: default;
        }

        .toolbarMenu__item.toolbarMenu__item--disabled .toolbarMenu__itemLabel,
        .toolbarMenu__item.toolbarMenu__item--disabled .toolbarMenu__itemLabel:hover {
            background-color: transparent;
            color: #ccc;
            cursor: default;
        }

        .toolbarMenu__subMenu .toolbarMenu__subMenu {
            left: 200px;
            top: -5px;
        }

        .toolbarMenu__subMenu .toolbarMenu__item.toolbarMenu__item--hasSubMenu > .toolbarMenu__itemLabel > .toolbarMenu__itemShortKeys {
            display: none;
        }

        .toolbarMenu__subMenu .toolbarMenu__item.toolbarMenu__item--hasSubMenu > .toolbarMenu__itemLabel::after {
            position: absolute;
            top: 0;
            right: 5px;
            content: "\25b6";
            font-size: 10px;
            color: #444;
            display: block;
        }

        .splitContainer {
            overflow: hidden;
        }

        .pane {
            border: 1px solid #ccc;
        }

        .docked {
            position: absolute;
        }

        .docked.docked--all,
        .docked.docked--left {
            left: 0;
        }

        .docked.docked--all,
        .docked.docked--right {
            right: 0;
        }

        .docked.docked--all,
        .docked.docked--top {
            top: 0;
        }

        .docked.docked--all,
        .docked.docked--bottom {
            bottom: 0;
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
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }
        .pane--hasTitle > .pane__body {
            top: 30px;
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

        .modal {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1000;
            background-color: rgba(0, 0, 0, 0.5);
            display: none;
        }
        .modal--opened {
            display: block;
        }

        .modal__window {
            width: 500px;
            min-height: 100px;
            margin: 10% auto;
            position: relative;
            background-color: #ffffff;
            box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.6);
        }
        .modal__title {
            height: 25px;
            border-bottom: 1px solid #ccc;
            background-color: #eeeeee;
            padding: 0 15px;
            line-height: 25px;
            font-size: 18px;
            font-weight: bold;
        }
        .modal__closeWindowButton {
            width: 25px;
            height: 25px;
            position: absolute;
            top: 0;
            right: 0;
            border: none;
            background-color: transparent;
            cursor: pointer;
        }
        .modal__closeWindowButton::after {
            width: 25px;
            height: 25px;
            content: "r";
            position: absolute;
            top: 0;
            right: 0;
            font-family: "Webdings";
            text-align: center;
            line-height: 25px;
            display: block;
        }
        .modal__closeWindowButton:hover {
            background-color: #dd0000;
            color: #ffffff;
        }

        .modal__body {
            padding: 15px;
        }
        .modal__body p:first-child {
            margin-top: 0;
        }

        .dialog__buttonsContainer {
            padding: 15px;
            text-align: right;
        }
        .button--dialog {
            margin: 0 3px;
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
    <script type="text/javascript" src="../node_modules/c-p/color-picker.min.js?v=<?= filemtime("../node_modules/c-p/color-picker.min.js"); ?>"></script>
    <script type="text/javascript" src="script/core.js?v=<?= filemtime("script/core.js"); ?>"></script>
</head>
<body>

    <!-- <div class="paneContainer">
        <div class="pane pane--docked pane--left pane--top pane--bottom pane--width25p" id="leftPane">
            <h3 class="pane__title">Left Pane</h3>
            <div class="pane__body"></div>
        </div>
        <div class="pane pane--docked pane--center pane--top pane--bottom pane--offset25p pane--width50pMinus300" id="editorPane">
            <h3 class="pane__title" id=editorPaneTitle>Editor Pane</h3>
            <div class="pane__body"></div>
        </div>
        <div class="pane pane--docked pane--right pane--top pane--bottom pane--width300" id="propertiesPane">
            <h3 class="pane__title">Properties Pane</h3>
            <div class="pane__body"></div>
        </div>
    </div> -->
</body>
</html>