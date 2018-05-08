var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/// <reference path="../typings/color-picker.d.ts" />
var MapBuilder;
(function (MapBuilder) {
    var App = /** @class */ (function () {
        function App(container) {
            var _this = this;
            this.globalProperties = {};
            this.isCtrlPressed = false;
            this.scaleIndex = 7;
            this.scale = 1.0;
            this.isDirty = false;
            this.onNewMenuItemClick = function (e) {
                if (_this.isDirty && !confirm("There are unsaved changes. Are you sure you want to continue?")) {
                    return;
                }
                _this.newProject();
            };
            this.onOpenMenuItemClick = function (e) {
                if (_this.isDirty && !confirm("There are unsaved changes. Are you sure you want to continue?")) {
                    return;
                }
            };
            this.onSaveMenuItemClick = function (e) {
            };
            this.onSaveAsMenuItemClick = function (e) {
            };
            this.onSettingsMenuItemClick = function (e) {
            };
            this.onCloseMenuItemClick = function (e) {
                if (_this.isDirty && !confirm("There are unsaved changes. Are you sure you want to continue?")) {
                    return;
                }
            };
            this.onWindowResize = function () {
                _this.invalidateTexturesCanvas();
            };
            this.onWindowMouseDown = function (e) {
                if (!_this.editorPane) {
                    return true;
                }
                if (e.target !== _this.editorPane.element && !_this.editorPane.element.contains(e.target)) {
                    return true;
                }
                if (e.stopPropagation)
                    e.stopPropagation();
                if (e.preventDefault)
                    e.preventDefault();
                e.cancelBubble = true;
                e.returnValue = false;
                _this.editorPane.element.dataset.mouseDown = "true";
                var mouseX = e.pageX - _this.editorPane.element.offsetLeft;
                var mouseY = e.pageY - _this.editorPane.element.offsetTop;
                _this.editorPane.element.dataset.startPointMouseX = mouseX.toString();
                _this.editorPane.element.dataset.startPointMouseY = mouseY.toString();
                _this.editorPane.element.dataset.startPointScrollX = _this.editorPane.element.dataset.scrollX;
                _this.editorPane.element.dataset.startPointScrollY = _this.editorPane.element.dataset.scrollY;
                return false;
            };
            this.onWindowMouseUp = function (e) {
                if (!_this.editorPane) {
                    return;
                }
                _this.editorPane.element.dataset.mouseDown = "false";
            };
            this.onWindowMouseMove = function (e) {
                if (!_this.editorPane) {
                    return;
                }
                if (_this.editorPane.element.dataset.mouseDown === "true") {
                    var startPointMouseX = parseFloat(_this.editorPane.element.dataset.startPointMouseX);
                    var startPointMouseY = parseFloat(_this.editorPane.element.dataset.startPointMouseY);
                    var startPointScrollX = parseFloat(_this.editorPane.element.dataset.startPointScrollX);
                    var startPointScrollY = parseFloat(_this.editorPane.element.dataset.startPointScrollY);
                    var offsetX = e.pageX - _this.editorPane.element.offsetLeft - startPointMouseX;
                    var offsetY = e.pageY - _this.editorPane.element.offsetTop - startPointMouseY;
                    var scrollX = Math.round(startPointScrollX + offsetX);
                    var scrollY = Math.round(startPointScrollY + offsetY);
                    _this.editorPane.element.dataset.scrollX = scrollX.toString();
                    _this.editorPane.element.dataset.scrollY = scrollY.toString();
                    setTimeout(function () { return _this.invalidateTexturesCanvas(); });
                }
            };
            this.onWindowKeyDown = function (e) {
                if (e.ctrlKey) {
                    _this.isCtrlPressed = true;
                }
            };
            this.onWindowKeyUp = function (e) {
                if (e.ctrlKey) {
                    _this.isCtrlPressed = false;
                }
            };
            this.onEditorWheel = function (e) {
                if (_this.isCtrlPressed) {
                    e.preventDefault();
                    console.log(e.deltaX, e.deltaY, e.deltaZ);
                    if (e.deltaY < 0) {
                        // zoom in
                        _this.scaleIndex++;
                        if (_this.scaleIndex >= MapBuilder.Constants.zoomScales.length) {
                            _this.scaleIndex = MapBuilder.Constants.zoomScales.length - 1;
                        }
                        _this.scale = MapBuilder.Constants.zoomScales[_this.scaleIndex];
                    }
                    else {
                        // zoom out
                        _this.scaleIndex--;
                        if (_this.scaleIndex < 0) {
                            _this.scaleIndex = 0;
                        }
                        _this.scale = MapBuilder.Constants.zoomScales[_this.scaleIndex];
                    }
                    //this.scale -= (e.deltaY / 100);
                    // if (Math.abs(this.scale) < 0.1) {
                    //     this.scale = -this.scale;
                    // }
                    _this.invalidateTexturesCanvas();
                }
            };
            this.onAboutMenuItemClick = function (event) {
                if (!_this.aboutModal) {
                    _this.aboutModal = new MapBuilder.Controls.Modal("About");
                    _this.aboutModal.body = "<p>v1.0.0</p>";
                }
                _this.aboutModal.open();
                _this.appContainer.pane.controls.add(_this.aboutModal);
            };
            this.container = container;
        }
        App.prototype.initialize = function () {
            this.appContainer = new MapBuilder.Controls.AppContainer();
            document.body.insertBefore(this.appContainer.element, document.body.childNodes[0]);
            this.buildToolbar();
            this.startPane = new MapBuilder.Controls.Pane("Start");
            this.startPane.dockMode = MapBuilder.Controls.DockMode.All;
            this.appContainer.pane.controls.add(this.startPane);
            this.initTexturesOverview();
            window.onresize = this.onWindowResize;
            window.onmousedown = this.onWindowMouseDown;
            window.onmouseup = this.onWindowMouseUp;
            window.onmousemove = this.onWindowMouseMove;
            window.onkeydown = this.onWindowKeyDown;
            window.onkeyup = this.onWindowKeyUp;
            this.transparentBackgroundImage = new Image();
            this.transparentBackgroundImage.src = MapBuilder.Constants.ResourcesPath + "/TransparentBackground.png";
        };
        App.prototype.initTexturesOverview = function () {
            var _this = this;
            this.startPane.bodyElement.innerHTML = "";
            var w = window;
            if (!w.availableSpritesheetTextures || w.availableSpritesheetTextures.length === 0) {
                this.startPane.bodyElement.innerHTML = "<p>No textures found</p>";
                return;
            }
            var list = document.createElement("ul");
            list.className = "texturesList";
            var currentSelectedItem = null;
            var _loop_1 = function () {
                var textureFile = w.availableSpritesheetTextures[i];
                var listItem = document.createElement("li");
                listItem.className = "texturesList__item";
                listItem.addEventListener("click", function () {
                    currentSelectedItem = listItem;
                    for (var n = 0; n < list.children.length; n++) {
                        list.children[0].className = "texturesList__item";
                    }
                    currentSelectedItem.className = "texturesList__item texturesList__item--active";
                });
                listItem.addEventListener("dblclick", function () {
                    _this.newProject(textureFile);
                });
                var thumbnail = document.createElement("div");
                thumbnail.className = "texturesList__itemThumbnail";
                var img = document.createElement("img");
                img.src = MapBuilder.Constants.TexturesPath + "/" + textureFile;
                var label = document.createElement("label");
                label.className = "texturesList__itemLabel";
                label.innerText = textureFile;
                thumbnail.appendChild(img);
                listItem.appendChild(thumbnail);
                listItem.appendChild(label);
                list.appendChild(listItem);
            };
            for (var i = 0; i < w.availableSpritesheetTextures.length; i++) {
                _loop_1();
            }
            this.startPane.bodyElement.appendChild(list);
        };
        App.prototype.newProject = function (textureFile) {
            var _this = this;
            this.appContainer.pane.controls.remove(this.startPane);
            this.splitContainer = new MapBuilder.Controls.SplitContainer();
            this.editorPane = new MapBuilder.Controls.EditorPane("Editor");
            this.propertiesPane = new MapBuilder.Controls.Pane("Properties");
            this.leftPane = new MapBuilder.Controls.Pane("Left Pane");
            //this.splitContainer.panes.add(this.leftPane);
            this.splitContainer.panes.add(this.leftPane);
            this.splitContainer.panes.add(this.editorPane);
            this.splitContainer.panes.add(this.propertiesPane);
            this.appContainer.pane.controls.add(this.splitContainer);
            this.splitContainer.setSplitterPositionFor(0, 25);
            this.splitContainer.setSplitterPositionFor(1, 75);
            this.editorPane.bodyElement.innerHTML = "";
            var globalProperties = document.createElement("div");
            globalProperties.className = "properties properties--global";
            var title = document.createElement("h3");
            title.innerText = "Global Properties";
            globalProperties.appendChild(title);
            globalProperties.appendChild(this.createPropertiesItem(this.globalProperties, "editorMode", "Editor Mode", MapBuilder.PropertyFieldTypes.Select, [["Spritesheet Map", MapBuilder.EditorModes.SpritesheetMap, true], ["Tileset Map", MapBuilder.EditorModes.TilesetMap]], function (v) { return _this.invalidateTexturesCanvas(); }));
            globalProperties.appendChild(this.createPropertiesItem(this.globalProperties, "rasterItemWidth", "Raster Item Width", MapBuilder.PropertyFieldTypes.Number, 32, function (v) { return _this.invalidateTexturesCanvas(); }));
            globalProperties.appendChild(this.createPropertiesItem(this.globalProperties, "rasterItemHeight", "Raster Item Height", MapBuilder.PropertyFieldTypes.Number, 32, function (v) { return _this.invalidateTexturesCanvas(); }));
            globalProperties.appendChild(this.createPropertiesItem(this.globalProperties, "rasterColor", "Raster Color", MapBuilder.PropertyFieldTypes.ColorPicker, "000000", function (v) { return _this.invalidateTexturesCanvas(); }));
            globalProperties.appendChild(this.createPropertiesItem(this.globalProperties, "rasterAlpha", "Raster Alpha", MapBuilder.PropertyFieldTypes.Number, 0.5, function (v) { return _this.invalidateTexturesCanvas(); }));
            this.propertiesPane.bodyElement.appendChild(globalProperties);
            this.texturesCanvas = document.createElement("canvas");
            this.texturesCanvas.className = "texturesCanvas";
            this.editorPane.bodyElement.appendChild(this.texturesCanvas);
            if (textureFile) {
                // TODO: Load with ajax
                var image_1 = new Image();
                image_1.addEventListener("load", function () {
                    _this.currentTexture = image_1;
                    _this.editorPane.element.dataset.scrollX = Math.round((_this.editorPane.element.clientWidth - image_1.width) / 2).toString();
                    _this.editorPane.element.dataset.scrollY = Math.round((_this.editorPane.element.clientHeight - image_1.height) / 2).toString();
                    _this.invalidateTexturesCanvas();
                });
                image_1.src = MapBuilder.Constants.TexturesPath + "/" + textureFile;
            }
        };
        App.prototype.buildToolbar = function () {
            this.toolbarMenu = new MapBuilder.Controls.ToolbarMenu();
            var fileMenuItem = new MapBuilder.Controls.ToolbarMenuItem("File");
            this.newMenuItem = new MapBuilder.Controls.ToolbarMenuItem("New", [MapBuilder.Keys.Control, MapBuilder.Keys.N]).setClickHandler(this.onNewMenuItemClick);
            fileMenuItem
                .addSubItem(this.newMenuItem)
                .addSubItem(new MapBuilder.Controls.ToolbarMenuItem("-"))
                .addSubItem(new MapBuilder.Controls.ToolbarMenuItem("Open...").setClickHandler(this.onOpenMenuItemClick))
                .addSubItem(new MapBuilder.Controls.ToolbarMenuItem("Open recent")
                .addSubItem(new MapBuilder.Controls.ToolbarMenuItem("Luffy.png")))
                .addSubItem(new MapBuilder.Controls.ToolbarMenuItem("-"))
                .addSubItem(new MapBuilder.Controls.ToolbarMenuItem("Save").disable().setClickHandler(this.onSaveMenuItemClick))
                .addSubItem(new MapBuilder.Controls.ToolbarMenuItem("Save as...").disable().setClickHandler(this.onSaveAsMenuItemClick))
                .addSubItem(new MapBuilder.Controls.ToolbarMenuItem("-"))
                .addSubItem(new MapBuilder.Controls.ToolbarMenuItem("Settings").setClickHandler(this.onSettingsMenuItemClick))
                .addSubItem(new MapBuilder.Controls.ToolbarMenuItem("-"))
                .addSubItem(new MapBuilder.Controls.ToolbarMenuItem("Close").setClickHandler(this.onCloseMenuItemClick));
            this.toolbarMenu
                .addMenuItem(fileMenuItem)
                .addMenuItem(new MapBuilder.Controls.ToolbarMenuItem("Edit")
                .addSubItem(new MapBuilder.Controls.ToolbarMenuItem("Undo", [MapBuilder.Keys.Control, MapBuilder.Keys.Z]).disable())
                .addSubItem(new MapBuilder.Controls.ToolbarMenuItem("Redo", [MapBuilder.Keys.Control, MapBuilder.Keys.Shift, MapBuilder.Keys.Z]).disable()))
                .addMenuItem(new MapBuilder.Controls.ToolbarMenuItem("View"))
                .addMenuItem(new MapBuilder.Controls.ToolbarMenuItem("Help").addSubItem(new MapBuilder.Controls.ToolbarMenuItem("About").setClickHandler(this.onAboutMenuItemClick)));
            this.appContainer.toolbarMenu = this.toolbarMenu;
        };
        App.prototype.clearPane = function (pane) {
            pane.innerHTML = "";
        };
        App.prototype.createPropertiesItem = function (propertiesObj, name, label, fieldType, defaultValue, onValueChanged) {
            var value = typeof propertiesObj[name] !== "undefined" && propertiesObj[name] !== null ? propertiesObj[name] : defaultValue;
            propertiesObj[name] = value;
            console.log(value);
            var row = document.createElement("p");
            row.className = "properties__row";
            var labelEl = document.createElement("label");
            labelEl.className = "properties__label";
            labelEl.innerText = label;
            var field = document.createElement("div");
            field.className = "properties__field";
            switch (fieldType) {
                case MapBuilder.PropertyFieldTypes.Text:
                case MapBuilder.PropertyFieldTypes.Number:
                case MapBuilder.PropertyFieldTypes.ColorPicker:
                    field.className += " properties__field--" + fieldType;
                    var input_1 = document.createElement("input");
                    input_1.name = name;
                    input_1.id = "properties__" + name;
                    input_1.type = fieldType === MapBuilder.PropertyFieldTypes.Number ? "number" : "text";
                    if (typeof value !== "undefined" && value !== null) {
                        input_1.value = value;
                    }
                    input_1.addEventListener("change", function (e) {
                        propertiesObj[name] = input_1.value;
                        if (onValueChanged) {
                            onValueChanged(input_1.value);
                        }
                    });
                    field.appendChild(input_1);
                    if (fieldType === MapBuilder.PropertyFieldTypes.ColorPicker) {
                        var colorPicker = new CP(input_1);
                        colorPicker.on("change", function (color) {
                            if (color.length === 3 || color.length === 6) {
                                color = "#" + color;
                            }
                            input_1.value = color;
                            propertiesObj[name] = input_1.value;
                            if (onValueChanged) {
                                onValueChanged(input_1.value);
                            }
                        });
                    }
                    break;
                case MapBuilder.PropertyFieldTypes.Select:
                    field.className += " properties__field--select";
                    var selectBox_1 = document.createElement("select");
                    selectBox_1.name = name;
                    selectBox_1.id = "properties__" + name;
                    if (typeof value !== "undefined" && value !== null && value.length > 0) {
                        for (var i = 0; i < value.length; i++) {
                            var item = value[i];
                            var itemLabel = item[0];
                            var itemValue = typeof item[1] !== "undefined" ? item[1] : itemLabel;
                            var itemSelected = item[2] || false;
                            var option = document.createElement("option");
                            option.value = itemValue;
                            option.innerText = itemLabel;
                            if (itemSelected) {
                                option.selected = true;
                            }
                            selectBox_1.appendChild(option);
                        }
                    }
                    selectBox_1.addEventListener("change", function (e) {
                        propertiesObj[name] = selectBox_1.value;
                        if (onValueChanged) {
                            onValueChanged(selectBox_1.value);
                        }
                    });
                    field.appendChild(selectBox_1);
                    break;
            }
            row.appendChild(labelEl);
            row.appendChild(field);
            return row;
        };
        App.prototype.invalidateTexturesCanvas = function () {
            if (!this.currentTexture) {
                return;
            }
            this.texturesCanvas.width = this.editorPane.element.clientWidth;
            this.texturesCanvas.height = this.editorPane.element.clientHeight;
            var centerPaneWidth = this.editorPane.element.clientWidth;
            var centerPaneHeight = this.editorPane.element.clientHeight;
            var maxX = Math.min(centerPaneWidth / this.globalProperties.rasterItemWidth, this.currentTexture.width / this.globalProperties.rasterItemWidth);
            var maxY = Math.min(centerPaneHeight / this.globalProperties.rasterItemHeight, this.currentTexture.height / this.globalProperties.rasterItemHeight);
            var scrollX = parseFloat(this.editorPane.element.dataset.scrollX);
            var scrollY = parseFloat(this.editorPane.element.dataset.scrollY);
            var context = this.texturesCanvas.getContext("2d");
            context.imageSmoothingEnabled = false;
            context.translate(scrollX, scrollY);
            //context.scale(this.zoomFactor, this.zoomFactor);
            context.clearRect(0, 0, this.texturesCanvas.width, this.texturesCanvas.height);
            context.save();
            var pattern = context.createPattern(this.transparentBackgroundImage, "repeat");
            context.fillStyle = pattern;
            context.scale(this.scale, this.scale);
            context.fillRect(0, 0, this.currentTexture.width, this.currentTexture.height);
            context.restore();
            context.drawImage(this.currentTexture, 0, 0, this.currentTexture.width * this.scale, this.currentTexture.height * this.scale);
            context.translate(0.5, 0.5);
            context.save();
            context.beginPath();
            context.rect(0, 0, this.currentTexture.width * this.scale, this.currentTexture.height * this.scale);
            context.clip();
            context.strokeStyle = this.globalProperties["rasterColor"] || "#000000";
            context.globalAlpha = this.globalProperties["rasterAlpha"];
            context.lineWidth = 1;
            for (var y = 0; y < maxY; y++) {
                for (var x = 0; x < maxX; x++) {
                    context.rect(x * this.globalProperties.rasterItemWidth * this.scale, y * this.globalProperties.rasterItemHeight * this.scale, this.globalProperties.rasterItemWidth * this.scale, this.globalProperties.rasterItemHeight * this.scale);
                }
            }
            context.stroke();
            context.restore();
            this.editorPane.title = "Editor Pane (" + (this.scale * 100) + "%)";
        };
        return App;
    }());
    MapBuilder.App = App;
})(MapBuilder || (MapBuilder = {}));
var MapBuilder;
(function (MapBuilder) {
    var Constants = /** @class */ (function () {
        function Constants() {
        }
        Constants.ResourcesPath = "Resources";
        Constants.TexturesPath = Constants.ResourcesPath + "/Textures";
        Constants.MapsPath = Constants.ResourcesPath + "/Maps";
        Constants.zoomScales = [
            0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10, 0.11, 0.12, 0.14, 0.15,
            0.17, 0.19, 0.21, 0.24, 0.27, 0.3, 0.34, 0.38, 0.42, 0.47, 0.53, 0.59, 0.66, 0.75,
            0.85, 1, 1.125, 1.25, 1.4, 1.6, 1.8, 2, 2.25, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8,
            9, 10, 11, 12, 13, 15, 17, 19, 21, 24, 27, 30, 32
        ];
        return Constants;
    }());
    MapBuilder.Constants = Constants;
})(MapBuilder || (MapBuilder = {}));
var MapBuilder;
(function (MapBuilder) {
    var EditorModes;
    (function (EditorModes) {
        EditorModes["SpritesheetMap"] = "SpritesheetMap";
        EditorModes["TilesetMap"] = "TilesetMap";
    })(EditorModes = MapBuilder.EditorModes || (MapBuilder.EditorModes = {}));
})(MapBuilder || (MapBuilder = {}));
var MapBuilder;
(function (MapBuilder) {
    var Keys;
    (function (Keys) {
        Keys[Keys["None"] = 0] = "None";
        Keys[Keys["LButton"] = 1] = "LButton";
        Keys[Keys["RButton"] = 2] = "RButton";
        Keys[Keys["Cancel"] = 3] = "Cancel";
        Keys[Keys["MButton"] = 4] = "MButton";
        Keys[Keys["XButton1"] = 5] = "XButton1";
        Keys[Keys["XButton2"] = 6] = "XButton2";
        Keys[Keys["Backspace"] = 8] = "Backspace";
        Keys[Keys["Tab"] = 9] = "Tab";
        Keys[Keys["NumSlash"] = 11] = "NumSlash";
        Keys[Keys["Enter"] = 13] = "Enter";
        Keys[Keys["Return"] = 13] = "Return";
        Keys[Keys["Shift"] = 16] = "Shift";
        Keys[Keys["Control"] = 17] = "Control";
        Keys[Keys["Alt"] = 18] = "Alt";
        Keys[Keys["Menu"] = 18] = "Menu";
        Keys[Keys["Pause"] = 19] = "Pause";
        Keys[Keys["CapsLock"] = 20] = "CapsLock";
        Keys[Keys["Escape"] = 27] = "Escape";
        Keys[Keys["Space"] = 32] = "Space";
        Keys[Keys["PageUp"] = 33] = "PageUp";
        Keys[Keys["Prior"] = 33] = "Prior";
        Keys[Keys["PageDown"] = 34] = "PageDown";
        Keys[Keys["Next"] = 34] = "Next";
        Keys[Keys["End"] = 35] = "End";
        Keys[Keys["Home"] = 36] = "Home";
        Keys[Keys["Left"] = 37] = "Left";
        Keys[Keys["Up"] = 38] = "Up";
        Keys[Keys["Right"] = 39] = "Right";
        Keys[Keys["Down"] = 40] = "Down";
        Keys[Keys["Select"] = 41] = "Select";
        Keys[Keys["Print"] = 42] = "Print";
        Keys[Keys["Execute"] = 43] = "Execute";
        Keys[Keys["Snapshot"] = 44] = "Snapshot";
        Keys[Keys["PrintScreen"] = 44] = "PrintScreen";
        Keys[Keys["Insert"] = 45] = "Insert";
        Keys[Keys["Delete"] = 46] = "Delete";
        Keys[Keys["Help"] = 47] = "Help";
        Keys[Keys["D0"] = 48] = "D0";
        Keys[Keys["D1"] = 49] = "D1";
        Keys[Keys["D2"] = 50] = "D2";
        Keys[Keys["D3"] = 51] = "D3";
        Keys[Keys["D4"] = 52] = "D4";
        Keys[Keys["D5"] = 53] = "D5";
        Keys[Keys["D6"] = 54] = "D6";
        Keys[Keys["D7"] = 55] = "D7";
        Keys[Keys["D8"] = 56] = "D8";
        Keys[Keys["D9"] = 57] = "D9";
        Keys[Keys["A"] = 65] = "A";
        Keys[Keys["B"] = 66] = "B";
        Keys[Keys["C"] = 67] = "C";
        Keys[Keys["D"] = 68] = "D";
        Keys[Keys["E"] = 69] = "E";
        Keys[Keys["F"] = 70] = "F";
        Keys[Keys["G"] = 71] = "G";
        Keys[Keys["H"] = 72] = "H";
        Keys[Keys["I"] = 73] = "I";
        Keys[Keys["J"] = 74] = "J";
        Keys[Keys["K"] = 75] = "K";
        Keys[Keys["L"] = 76] = "L";
        Keys[Keys["M"] = 77] = "M";
        Keys[Keys["N"] = 78] = "N";
        Keys[Keys["O"] = 79] = "O";
        Keys[Keys["P"] = 80] = "P";
        Keys[Keys["Q"] = 81] = "Q";
        Keys[Keys["R"] = 82] = "R";
        Keys[Keys["S"] = 83] = "S";
        Keys[Keys["T"] = 84] = "T";
        Keys[Keys["U"] = 85] = "U";
        Keys[Keys["V"] = 86] = "V";
        Keys[Keys["W"] = 87] = "W";
        Keys[Keys["X"] = 88] = "X";
        Keys[Keys["Y"] = 89] = "Y";
        Keys[Keys["Z"] = 90] = "Z";
        Keys[Keys["WinKey"] = 91] = "WinKey";
        Keys[Keys["WinKeyL"] = 91] = "WinKeyL";
        Keys[Keys["WinKeyR"] = 92] = "WinKeyR";
        Keys[Keys["CommandKey"] = 91] = "CommandKey";
        Keys[Keys["Apps"] = 93] = "Apps";
        Keys[Keys["ContextMenu"] = 93] = "ContextMenu";
        Keys[Keys["Num0"] = 96] = "Num0";
        Keys[Keys["Num1"] = 97] = "Num1";
        Keys[Keys["Num2"] = 98] = "Num2";
        Keys[Keys["Num3"] = 99] = "Num3";
        Keys[Keys["Num4"] = 100] = "Num4";
        Keys[Keys["Num5"] = 101] = "Num5";
        Keys[Keys["Num6"] = 102] = "Num6";
        Keys[Keys["Num7"] = 103] = "Num7";
        Keys[Keys["Num8"] = 104] = "Num8";
        Keys[Keys["Num9"] = 105] = "Num9";
        Keys[Keys["Multiply"] = 106] = "Multiply";
        Keys[Keys["Add"] = 107] = "Add";
        Keys[Keys["Separator"] = 108] = "Separator";
        Keys[Keys["NumDash"] = 109] = "NumDash";
        Keys[Keys["Subtract"] = 109] = "Subtract";
        Keys[Keys["Decimal"] = 110] = "Decimal";
        Keys[Keys["NumForwardSlash"] = 111] = "NumForwardSlash";
        Keys[Keys["Divide"] = 111] = "Divide";
        Keys[Keys["F1"] = 112] = "F1";
        Keys[Keys["F2"] = 113] = "F2";
        Keys[Keys["F3"] = 114] = "F3";
        Keys[Keys["F4"] = 115] = "F4";
        Keys[Keys["F5"] = 116] = "F5";
        Keys[Keys["F6"] = 117] = "F6";
        Keys[Keys["F7"] = 118] = "F7";
        Keys[Keys["F8"] = 119] = "F8";
        Keys[Keys["F9"] = 120] = "F9";
        Keys[Keys["F10"] = 121] = "F10";
        Keys[Keys["F11"] = 122] = "F11";
        Keys[Keys["F12"] = 123] = "F12";
        Keys[Keys["F13"] = 124] = "F13";
        Keys[Keys["F14"] = 125] = "F14";
        Keys[Keys["F15"] = 126] = "F15";
        Keys[Keys["F16"] = 127] = "F16";
        Keys[Keys["F17"] = 128] = "F17";
        Keys[Keys["F18"] = 129] = "F18";
        Keys[Keys["F19"] = 130] = "F19";
        Keys[Keys["F20"] = 131] = "F20";
        Keys[Keys["F21"] = 132] = "F21";
        Keys[Keys["F22"] = 133] = "F22";
        Keys[Keys["F23"] = 134] = "F23";
        Keys[Keys["F24"] = 135] = "F24";
        Keys[Keys["NumLock"] = 144] = "NumLock";
        Keys[Keys["Scroll"] = 145] = "Scroll";
        Keys[Keys["ScrollLock"] = 145] = "ScrollLock";
        Keys[Keys["VolumeMute"] = 173] = "VolumeMute";
        Keys[Keys["VolumeDown"] = 174] = "VolumeDown";
        Keys[Keys["VolumeUp"] = 175] = "VolumeUp";
        Keys[Keys["MediaNextTrack"] = 176] = "MediaNextTrack";
        Keys[Keys["MediaPreviousTrack"] = 177] = "MediaPreviousTrack";
        Keys[Keys["MediaStop"] = 178] = "MediaStop";
        Keys[Keys["MediaPlayPause"] = 179] = "MediaPlayPause";
        Keys[Keys["SelectMedia"] = 181] = "SelectMedia";
        Keys[Keys["MyComputer"] = 182] = "MyComputer";
        Keys[Keys["Calculator"] = 183] = "Calculator";
        Keys[Keys["Semicolon"] = 186] = "Semicolon";
        Keys[Keys["Plus"] = 187] = "Plus";
        Keys[Keys["Comma"] = 188] = "Comma";
        Keys[Keys["Dash"] = 189] = "Dash";
        Keys[Keys["Period"] = 190] = "Period";
        Keys[Keys["ForwardSlash"] = 191] = "ForwardSlash";
        Keys[Keys["QuestionMark"] = 191] = "QuestionMark";
        Keys[Keys["Tilde"] = 192] = "Tilde";
        Keys[Keys["BackTick"] = 192] = "BackTick";
        Keys[Keys["OpenBracket"] = 219] = "OpenBracket";
        Keys[Keys["Pipe"] = 220] = "Pipe";
        Keys[Keys["CloseBracket"] = 221] = "CloseBracket";
        Keys[Keys["Quote"] = 222] = "Quote";
        Keys[Keys["Backslash"] = 226] = "Backslash";
    })(Keys = MapBuilder.Keys || (MapBuilder.Keys = {}));
    var KeysStringHelper = /** @class */ (function () {
        function KeysStringHelper() {
        }
        KeysStringHelper.toString = function (key) {
            switch (key) {
                case Keys.Control:
                    return "Ctrl";
                case Keys.Comma:
                    return ",";
                case Keys.BackTick:
                    return "`";
                default:
                    return Keys[key];
            }
        };
        return KeysStringHelper;
    }());
    MapBuilder.KeysStringHelper = KeysStringHelper;
})(MapBuilder || (MapBuilder = {}));
var MapBuilder;
(function (MapBuilder) {
    var PropertyFieldTypes;
    (function (PropertyFieldTypes) {
        PropertyFieldTypes["Text"] = "text";
        PropertyFieldTypes["Number"] = "number";
        PropertyFieldTypes["Boolean"] = "boolean";
        PropertyFieldTypes["Select"] = "select";
        PropertyFieldTypes["ColorPicker"] = "colorPicker";
    })(PropertyFieldTypes = MapBuilder.PropertyFieldTypes || (MapBuilder.PropertyFieldTypes = {}));
})(MapBuilder || (MapBuilder = {}));
window.onload = function () {
    var app = new MapBuilder.App(document.body);
    app.initialize();
};
var MapBuilder;
(function (MapBuilder) {
    var Controls;
    (function (Controls) {
        var Control = /** @class */ (function () {
            function Control() {
                this._dockMode = Controls.DockMode.None;
                this._isVisible = true;
                this._hashCode = ++Control.controlCounter;
            }
            Object.defineProperty(Control.prototype, "hashCode", {
                get: function () {
                    return this._hashCode;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Control.prototype, "element", {
                get: function () {
                    return this._element || (this._element = this.createElementInternal());
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Control.prototype, "dockMode", {
                get: function () {
                    return this._dockMode;
                },
                set: function (dockMode) {
                    this._dockMode = dockMode;
                    if (this._element) {
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Control.prototype, "isVisible", {
                get: function () {
                    return this._isVisible;
                },
                set: function (isVisible) {
                    this._isVisible = isVisible;
                    if (this._element) {
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Control.prototype.invalidate = function () {
                if (this.dockMode !== Controls.DockMode.None) {
                    this.element.classList.add("docked");
                    var dockModeStrings = Controls.DockModeStringHelper.toString(this.dockMode).toLowerCase().split(" ");
                    for (var i = 0; i < dockModeStrings.length; i++) {
                        this.element.classList.add("docked--" + dockModeStrings[i]);
                    }
                }
                if (!this.isVisible) {
                    if (!this.element.classList.contains("control--hidden")) {
                        this.element.classList.add("control--hidden");
                    }
                }
                else {
                    if (this.element.classList.contains("control--hidden")) {
                        this.element.classList.remove("control--hidden");
                    }
                }
                this.onInvalidate();
            };
            Control.prototype.createElementInternal = function () {
                var element = this.createElement();
                element.classList.add("control");
                return element;
            };
            Control.controlCounter = 0;
            return Control;
        }());
        Controls.Control = Control;
    })(Controls = MapBuilder.Controls || (MapBuilder.Controls = {}));
})(MapBuilder || (MapBuilder = {}));
/// <reference path="Control.ts" />
var MapBuilder;
(function (MapBuilder) {
    var Controls;
    (function (Controls) {
        var AppContainer = /** @class */ (function () {
            function AppContainer() {
                this._toolbarMenuAdded = false;
                this._pane = new Controls.Pane();
                this._pane.dockMode = Controls.DockMode.All;
            }
            Object.defineProperty(AppContainer.prototype, "element", {
                get: function () {
                    return this._element || (this._element = this.createElement());
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppContainer.prototype, "hashCode", {
                get: function () {
                    return Number.MIN_VALUE;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppContainer.prototype, "toolbarMenu", {
                get: function () {
                    return this._toolbarMenu;
                },
                set: function (toolbarMenu) {
                    if (this._toolbarMenu) {
                        this._toolbarMenu.element.remove();
                    }
                    this._toolbarMenu = toolbarMenu;
                    this._toolbarMenuAdded = false;
                    this.invalidate();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppContainer.prototype, "pane", {
                get: function () {
                    return this._pane;
                },
                enumerable: true,
                configurable: true
            });
            AppContainer.prototype.invalidate = function () {
                if (this._toolbarMenu) {
                    if (!this._toolbarMenuAdded) {
                        this._element.insertBefore(this._toolbarMenu.element, this._element.childNodes[0]);
                        this._toolbarMenuAdded = true;
                    }
                    this._toolbarMenu.invalidate();
                    if (!this._element.classList.contains("appContainer--hasToolbarMenu")) {
                        this._element.classList.add("appContainer--hasToolbarMenu");
                    }
                }
                else {
                    if (this._element.classList.contains("appContainer--hasToolbarMenu")) {
                        this._element.classList.remove("appContainer--hasToolbarMenu");
                    }
                }
            };
            AppContainer.prototype.createElement = function () {
                var element = document.createElement("div");
                element.classList.add("appContainer");
                if (this._toolbarMenu) {
                    element.insertBefore(this._toolbarMenu.element, this._element.childNodes[0]);
                    this._toolbarMenuAdded = true;
                }
                element.appendChild(this.pane.element);
                return element;
            };
            return AppContainer;
        }());
        Controls.AppContainer = AppContainer;
    })(Controls = MapBuilder.Controls || (MapBuilder.Controls = {}));
})(MapBuilder || (MapBuilder = {}));
/// <reference path="Control.ts" />
var MapBuilder;
(function (MapBuilder) {
    var Controls;
    (function (Controls) {
        var Button = /** @class */ (function (_super) {
            __extends(Button, _super);
            function Button(label, clickHandler) {
                var _this = _super.call(this) || this;
                _this.onClick = function (event) {
                    if (_this._clickHandler) {
                        _this._clickHandler.apply(event);
                    }
                };
                _this._label = label;
                _this._clickHandler = clickHandler;
                return _this;
            }
            Object.defineProperty(Button.prototype, "label", {
                get: function () {
                    return this._label;
                },
                set: function (label) {
                    this._label = label;
                    this.invalidate();
                },
                enumerable: true,
                configurable: true
            });
            Button.prototype.setClickHandler = function (clickHandler) {
                this._clickHandler = clickHandler;
                return this;
            };
            Button.prototype.onInvalidate = function () {
                if (this._label) {
                    this.element.innerText = this._label;
                }
            };
            Button.prototype.createElement = function () {
                var element = document.createElement("button");
                element.classList.add("button");
                element.addEventListener("click", this.onClick);
                return element;
            };
            return Button;
        }(Controls.Control));
        Controls.Button = Button;
    })(Controls = MapBuilder.Controls || (MapBuilder.Controls = {}));
})(MapBuilder || (MapBuilder = {}));
var MapBuilder;
(function (MapBuilder) {
    var Controls;
    (function (Controls) {
        var ControlContainer = /** @class */ (function (_super) {
            __extends(ControlContainer, _super);
            function ControlContainer() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            ControlContainer.prototype.invalidate = function () {
                _super.prototype.invalidate.call(this);
                if (this.controls.length > 0) {
                    for (var i = 0; i < this.controls.length; i++) {
                        this.controls[i].invalidate();
                    }
                }
            };
            Object.defineProperty(ControlContainer.prototype, "controls", {
                get: function () {
                    return this._controls || (this._controls = this.createControlsCollection());
                },
                enumerable: true,
                configurable: true
            });
            ControlContainer.prototype.createControlsCollection = function () {
                return new Controls.ControlsCollection(this);
            };
            return ControlContainer;
        }(Controls.Control));
        Controls.ControlContainer = ControlContainer;
    })(Controls = MapBuilder.Controls || (MapBuilder.Controls = {}));
})(MapBuilder || (MapBuilder = {}));
/// <reference path="IControlCollection.ts" />
/// <reference path="IControl.ts" />
/// <reference path="IControlCollection.ts" />
var MapBuilder;
(function (MapBuilder) {
    var Controls;
    (function (Controls) {
        var ControlsCollection = /** @class */ (function () {
            function ControlsCollection(owner, containerElement) {
                this._length = 0;
                this._valueCollection = {};
                this._owner = owner;
                this._containerElement = containerElement || owner.element;
            }
            Object.defineProperty(ControlsCollection.prototype, "length", {
                get: function () {
                    return this._length;
                },
                enumerable: true,
                configurable: true
            });
            ControlsCollection.prototype.add = function (control) {
                if (this.contains(control)) {
                    return;
                }
                this._valueCollection[control.hashCode.toString()] = {
                    index: this._length,
                    control: control
                };
                this[this._length] = control;
                this._length++;
                if (this._containerElement && !this._containerElement.contains(control.element)) {
                    this._containerElement.appendChild(control.element);
                }
                if (this._owner) {
                    this._owner.invalidate();
                }
                else {
                    control.invalidate();
                }
            };
            ControlsCollection.prototype.remove = function (control) {
                var index = this.indexOf(control);
                console.log("remove:", index, control, this._valueCollection);
                ;
                if (index < 0) {
                    return;
                }
                delete this[index];
                delete this._valueCollection[control.hashCode.toString()];
                this._length--;
                // TODO: Re-order [index] array-access.
                console.log("REMOVE START");
                control.element.remove();
                if (this._owner) {
                    this._owner.invalidate();
                }
                else {
                    control.invalidate();
                }
            };
            ControlsCollection.prototype.contains = function (control) {
                var hashCodeString = control.hashCode.toString();
                return typeof (this._valueCollection[hashCodeString]) !== "undefined" && this._valueCollection[hashCodeString] !== null;
            };
            ControlsCollection.prototype.indexOf = function (control) {
                return (this._valueCollection[control.hashCode.toString()] || { index: -1, control: null }).index;
            };
            return ControlsCollection;
        }());
        Controls.ControlsCollection = ControlsCollection;
    })(Controls = MapBuilder.Controls || (MapBuilder.Controls = {}));
})(MapBuilder || (MapBuilder = {}));
/// <reference path="Control.ts" />
var MapBuilder;
(function (MapBuilder) {
    var Controls;
    (function (Controls) {
        var Modal = /** @class */ (function (_super) {
            __extends(Modal, _super);
            function Modal(title) {
                var _this = _super.call(this) || this;
                _this.onWindowCloseButtonClick = function (event) {
                    _this.close();
                };
                _this._title = title;
                _this.isVisible = false;
                return _this;
            }
            Object.defineProperty(Modal.prototype, "title", {
                get: function () {
                    return this._title;
                },
                set: function (title) {
                    this._title = title;
                    this.invalidate();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Modal.prototype, "body", {
                get: function () {
                    return this._body;
                },
                set: function (body) {
                    this._body = body;
                    this.invalidate();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Modal.prototype, "windowElement", {
                get: function () {
                    return this._windowElement;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Modal.prototype, "closeWindowButtonElement", {
                get: function () {
                    return this._closeWindowButtonElement;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Modal.prototype, "titleElement", {
                get: function () {
                    return this._titleElement;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Modal.prototype, "bodyElement", {
                get: function () {
                    return this._bodyElement;
                },
                enumerable: true,
                configurable: true
            });
            Modal.prototype.setCloseListener = function (listener) {
                this._closeListener = listener;
                return this;
            };
            Modal.prototype.open = function () {
                this.isVisible = true;
                return this;
            };
            Modal.prototype.close = function () {
                this.isVisible = false;
                if (this._closeListener) {
                    this._closeListener.apply(this);
                }
                return this;
            };
            Modal.prototype.onInvalidate = function () {
                if (!this._windowElement) {
                    return;
                }
                if (this._title) {
                    if (!this._titleElement) {
                        this._titleElement = this.createTitleElement(this._windowElement);
                    }
                    this._titleElement.innerText = this._title;
                }
                else if (this._titleElement) {
                    this._titleElement.remove();
                    this._titleElement = null;
                }
                if (this._body) {
                    if (!this._bodyElement) {
                        this._bodyElement = this.createBodyElement(this._windowElement);
                    }
                    this._bodyElement.innerHTML = this._body;
                }
                else if (this._bodyElement) {
                    this._bodyElement.remove();
                    this._bodyElement = null;
                }
                if (this.isVisible) {
                    if (!this.element.classList.contains("modal--opened")) {
                        this.element.classList.add("modal--opened");
                    }
                }
                else {
                    if (this.element.classList.contains("modal--opened")) {
                        this.element.classList.remove("modal--opened");
                    }
                }
            };
            Modal.prototype.createElement = function () {
                var element = document.createElement("div");
                element.classList.add("modal");
                this._windowElement = this.createWindowElement(element);
                return element;
            };
            Modal.prototype.createWindowElement = function (parentElement) {
                var element = document.createElement("div");
                element.classList.add("modal__window");
                this._closeWindowButtonElement = this.createCloseWindowButtonElement(element);
                if (this._title && !this._titleElement) {
                    this._titleElement = this.createTitleElement(element);
                }
                if (this._body && !this._bodyElement) {
                    this._bodyElement = this.createBodyElement(element);
                }
                parentElement.appendChild(element);
                return element;
            };
            Modal.prototype.createCloseWindowButtonElement = function (parentElement) {
                var element = document.createElement("button");
                element.setAttribute("type", "button");
                element.classList.add("modal__closeWindowButton");
                element.addEventListener("click", this.onWindowCloseButtonClick);
                parentElement.appendChild(element);
                return element;
            };
            Modal.prototype.createTitleElement = function (parentElement) {
                var element = document.createElement("div");
                element.classList.add("modal__title");
                parentElement.appendChild(element);
                return element;
            };
            Modal.prototype.createBodyElement = function (parentElement) {
                var element = document.createElement("div");
                element.classList.add("modal__body");
                element.innerHTML = this._body;
                parentElement.appendChild(element);
                return element;
            };
            return Modal;
        }(Controls.Control));
        Controls.Modal = Modal;
    })(Controls = MapBuilder.Controls || (MapBuilder.Controls = {}));
})(MapBuilder || (MapBuilder = {}));
/// <reference path="Modal.ts" />
var MapBuilder;
(function (MapBuilder) {
    var Controls;
    (function (Controls) {
        var Dialog = /** @class */ (function (_super) {
            __extends(Dialog, _super);
            function Dialog() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._buttons = [];
                _this.onDialogButtonClick = function (event) {
                    _this.close();
                };
                return _this;
            }
            Object.defineProperty(Dialog.prototype, "buttons", {
                get: function () {
                    return this._buttons;
                },
                enumerable: true,
                configurable: true
            });
            Dialog.prototype.onInvalidate = function () {
                _super.prototype.invalidate.call(this);
                if (!this.windowElement) {
                    return;
                }
                if (this._buttons.length > 0) {
                    if (!this._buttonsContainerElement) {
                        this._buttonsContainerElement = this.createButtonsContainerElement(this.windowElement);
                    }
                    this._buttonsContainerElement.innerHTML = "";
                    for (var i = 0; i < this._buttons.length; i++) {
                        var button = this._buttons[i];
                        this._buttonsContainerElement.appendChild(button.element);
                        button.element.addEventListener("click", this.onDialogButtonClick);
                        button.invalidate();
                        if (!button.element.classList.contains("button--dialog")) {
                            button.element.classList.add("button--dialog");
                        }
                    }
                    if (this.body && this.bodyElement) {
                        this.windowElement.insertBefore(this.bodyElement, this._buttonsContainerElement);
                    }
                }
            };
            Dialog.prototype.createElement = function () {
                var element = _super.prototype.createElement.call(this);
                element.classList.add("modal--dialog");
                element.classList.add("dialog");
                return element;
            };
            Dialog.prototype.createWindowElement = function (parentElement) {
                var element = _super.prototype.createWindowElement.call(this, parentElement);
                this._buttonsContainerElement = this.createButtonsContainerElement(element);
                return element;
            };
            Dialog.prototype.createButtonsContainerElement = function (parentElement) {
                var element = document.createElement("div");
                element.classList.add("dialog__buttonsContainer");
                parentElement.appendChild(element);
                return element;
            };
            return Dialog;
        }(Controls.Modal));
        Controls.Dialog = Dialog;
    })(Controls = MapBuilder.Controls || (MapBuilder.Controls = {}));
})(MapBuilder || (MapBuilder = {}));
var MapBuilder;
(function (MapBuilder) {
    var Controls;
    (function (Controls) {
        var DockMode;
        (function (DockMode) {
            DockMode[DockMode["None"] = 0] = "None";
            DockMode[DockMode["Top"] = 1] = "Top";
            DockMode[DockMode["Right"] = 2] = "Right";
            DockMode[DockMode["Bottom"] = 4] = "Bottom";
            DockMode[DockMode["Left"] = 8] = "Left";
            DockMode[DockMode["All"] = 15] = "All";
        })(DockMode = Controls.DockMode || (Controls.DockMode = {}));
        var DockModeStringHelper = /** @class */ (function () {
            function DockModeStringHelper() {
            }
            DockModeStringHelper.toString = function (dockMode) {
                var string = "";
                if (dockMode === DockMode.None) {
                    return DockMode[DockMode.None];
                }
                if (typeof DockMode[dockMode] === "undefined") {
                    var strings = [];
                    if ((dockMode & DockMode.Top) === DockMode.Top) {
                        strings.push(DockMode[DockMode.Top]);
                    }
                    if ((dockMode & DockMode.Right) === DockMode.Right) {
                        strings.push(DockMode[DockMode.Right]);
                    }
                    if ((dockMode & DockMode.Bottom) === DockMode.Bottom) {
                        strings.push(DockMode[DockMode.Bottom]);
                    }
                    if ((dockMode & DockMode.Left) === DockMode.Left) {
                        strings.push(DockMode[DockMode.Left]);
                    }
                    string = strings.join(" ");
                }
                else {
                    // TODO: join dockMode's to string.
                    return DockMode[dockMode].toLowerCase();
                }
                return string;
            };
            return DockModeStringHelper;
        }());
        Controls.DockModeStringHelper = DockModeStringHelper;
    })(Controls = MapBuilder.Controls || (MapBuilder.Controls = {}));
})(MapBuilder || (MapBuilder = {}));
/// <reference path="ControlContainer.ts" />
var MapBuilder;
(function (MapBuilder) {
    var Controls;
    (function (Controls) {
        var Pane = /** @class */ (function (_super) {
            __extends(Pane, _super);
            function Pane(title) {
                var _this = _super.call(this) || this;
                _this._title = title;
                return _this;
            }
            Object.defineProperty(Pane.prototype, "bodyElement", {
                get: function () {
                    return this._bodyElement;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Pane.prototype, "title", {
                get: function () {
                    return this._title;
                },
                set: function (title) {
                    this._title = title;
                    this.invalidate();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Pane.prototype, "titleBarElement", {
                get: function () {
                    return this._titleBarElement;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Pane.prototype, "titleElement", {
                get: function () {
                    return this._titleElement;
                },
                enumerable: true,
                configurable: true
            });
            Pane.prototype.onInvalidate = function () {
                if (this.title) {
                    if (!this._titleBarElement) {
                        this._titleBarElement = this.createTitleBarElement(this.element);
                    }
                    if (!this.element.classList.contains("pane--hasTitle")) {
                        this.element.classList.add("pane--hasTitle");
                    }
                    this._titleElement.innerText = this.title;
                }
                else {
                    if (this._titleBarElement) {
                        this._titleBarElement.remove();
                    }
                    if (this.element.classList.contains("pane--hasTitle")) {
                        this.element.classList.remove("pane--hasTitle");
                    }
                    this._titleBarElement = null;
                }
                if (!this._bodyElement) {
                    this._bodyElement = this.createBodyElement(this.element);
                }
            };
            Pane.prototype.createElement = function () {
                var element = document.createElement("div");
                element.classList.add("pane");
                if (this.title) {
                    this._titleBarElement = this.createTitleBarElement(element);
                }
                this._bodyElement = this.createBodyElement(element);
                return element;
            };
            Pane.prototype.createTitleBarElement = function (parentElement) {
                var titleBarElement = document.createElement("div");
                titleBarElement.classList.add("pane__titleBar");
                this._titleElement = this.createTitleElement(titleBarElement);
                parentElement.appendChild(titleBarElement);
                return titleBarElement;
            };
            Pane.prototype.createTitleElement = function (parentElement) {
                var titleElement = document.createElement("h3");
                titleElement.classList.add("pane__title");
                parentElement.appendChild(titleElement);
                return titleElement;
            };
            Pane.prototype.createBodyElement = function (parentElement) {
                var bodyElement = document.createElement("div");
                bodyElement.classList.add("pane__body");
                parentElement.appendChild(bodyElement);
                return bodyElement;
            };
            Pane.prototype.createControlsCollection = function () {
                return new Controls.ControlsCollection(this, this._bodyElement);
            };
            return Pane;
        }(Controls.ControlContainer));
        Controls.Pane = Pane;
    })(Controls = MapBuilder.Controls || (MapBuilder.Controls = {}));
})(MapBuilder || (MapBuilder = {}));
/// <reference path="Pane.ts" />
var MapBuilder;
(function (MapBuilder) {
    var Controls;
    (function (Controls) {
        var EditorPane = /** @class */ (function (_super) {
            __extends(EditorPane, _super);
            function EditorPane(title) {
                return _super.call(this, title) || this;
            }
            return EditorPane;
        }(Controls.Pane));
        Controls.EditorPane = EditorPane;
    })(Controls = MapBuilder.Controls || (MapBuilder.Controls = {}));
})(MapBuilder || (MapBuilder = {}));
/// <reference path="DockMode.ts" />
var MapBuilder;
(function (MapBuilder) {
    var Controls;
    (function (Controls) {
        var SplitContainerPaneCollection = /** @class */ (function () {
            function SplitContainerPaneCollection(owner) {
                this._valueCollection = {};
                this._length = 0;
                this._owner = owner;
                this._containerElement = owner.element;
            }
            Object.defineProperty(SplitContainerPaneCollection.prototype, "length", {
                get: function () {
                    return this._length;
                },
                enumerable: true,
                configurable: true
            });
            SplitContainerPaneCollection.prototype.add = function (pane) {
                if (this.contains(pane)) {
                    return;
                }
                this._valueCollection[pane.hashCode.toString()] = {
                    index: this._length,
                    pane: pane
                };
                this[this._length] = pane;
                this._length++;
                pane.dockMode = Controls.DockMode.Top | Controls.DockMode.Bottom;
                if (this._containerElement && !this._containerElement.contains(pane.element)) {
                    this._containerElement.appendChild(pane.element);
                }
                this._owner.autoCalculateSplitPositions();
            };
            SplitContainerPaneCollection.prototype.remove = function (pane) {
                var index = this.indexOf(pane);
                if (index < 0) {
                    return;
                }
                delete this[index];
                delete this._valueCollection[pane.hashCode.toString()];
                this._length--;
                // TODO: Re-order [index] array-access.
                pane.element.remove();
                if (this._owner) {
                    this._owner.invalidate();
                }
                else {
                    pane.invalidate();
                }
            };
            SplitContainerPaneCollection.prototype.contains = function (pane) {
                return typeof this._valueCollection[pane.hashCode] !== "undefined" && this._valueCollection[pane.hashCode] !== null;
            };
            SplitContainerPaneCollection.prototype.indexOf = function (control) {
                return (this._valueCollection[control.hashCode.toString()] || { index: -1, pane: null }).index;
            };
            return SplitContainerPaneCollection;
        }());
        Controls.SplitContainerPaneCollection = SplitContainerPaneCollection;
        var SplitContainer = /** @class */ (function (_super) {
            __extends(SplitContainer, _super);
            function SplitContainer() {
                var _this = _super.call(this) || this;
                _this._splitterPositions = [];
                _this._panes = new SplitContainerPaneCollection(_this);
                _this.dockMode = Controls.DockMode.All;
                return _this;
            }
            Object.defineProperty(SplitContainer.prototype, "paneCount", {
                get: function () {
                    return this._panes.length;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SplitContainer.prototype, "splitterPositions", {
                get: function () {
                    return this._splitterPositions.slice();
                },
                enumerable: true,
                configurable: true
            });
            SplitContainer.prototype.setSplitterPositionFor = function (index, position) {
                console.log("setSplitterPositionFor", index, position);
                this._splitterPositions[index] = Math.max(0, Math.min(100, position));
                this.invalidate();
            };
            Object.defineProperty(SplitContainer.prototype, "panes", {
                get: function () {
                    return this._panes;
                },
                enumerable: true,
                configurable: true
            });
            SplitContainer.prototype.autoCalculateSplitPositions = function (invalidate) {
                if (invalidate === void 0) { invalidate = true; }
                var paneWidth = 100 / this._panes.length;
                this._splitterPositions = [];
                for (var i = 1; i < this._panes.length; i++) {
                    this._splitterPositions.push(paneWidth * i);
                }
                if (invalidate) {
                    this.invalidate();
                }
            };
            SplitContainer.prototype.onInvalidate = function () {
                if (!this._panes) {
                    return;
                }
                if ((!this._splitterPositions || this._splitterPositions.length == 0) && this._panes.length > 0) {
                    this.autoCalculateSplitPositions(false);
                }
                if (this._splitterPositions.length > 0) {
                    var paneWidth = this._splitterPositions[0];
                    var paneX = 0;
                    console.log("this._splitterPositions:", this._splitterPositions);
                    console.log("paneWidth:", paneWidth, "paneX:", paneX);
                    for (var i = 0; i < this._panes.length; i++) {
                        this._panes[i].invalidate();
                        if (i === this._panes.length - 1) {
                            paneWidth = 100 - this._splitterPositions[i - 1];
                        }
                        this._panes[i].element.style.width = paneWidth + "%";
                        this._panes[i].element.style.left = paneX + "%";
                        if (i < this._splitterPositions.length) {
                            paneWidth = this._splitterPositions[i] - paneWidth;
                            paneX += this._splitterPositions[i];
                        }
                        console.log("paneWidth:", paneWidth, "paneX:", paneX);
                    }
                }
            };
            SplitContainer.prototype.createElement = function () {
                var element = document.createElement("div");
                element.classList.add("splitContainer");
                this._splitterPositions = [];
                if (this._panes && this._panes.length > 0) {
                    this.autoCalculateSplitPositions(false);
                }
                return element;
            };
            return SplitContainer;
        }(Controls.Control));
        Controls.SplitContainer = SplitContainer;
    })(Controls = MapBuilder.Controls || (MapBuilder.Controls = {}));
})(MapBuilder || (MapBuilder = {}));
var MapBuilder;
(function (MapBuilder) {
    var Controls;
    (function (Controls) {
        var ToolbarMenu = /** @class */ (function (_super) {
            __extends(ToolbarMenu, _super);
            function ToolbarMenu() {
                var _this = _super.call(this) || this;
                _this._menuItems = [];
                return _this;
            }
            Object.defineProperty(ToolbarMenu.prototype, "menuItems", {
                get: function () {
                    return this._menuItems.slice();
                },
                enumerable: true,
                configurable: true
            });
            ToolbarMenu.prototype.addMenuItem = function (menuItem) {
                this._menuItems.push(menuItem);
                if (this._menuElement) {
                    this.invalidate();
                }
                return this;
            };
            ToolbarMenu.prototype.onInvalidate = function () {
                if (this._menuItems.length === 0) {
                    return;
                }
                if (!this._menuElement) {
                    this._menuElement = this.createMenuElement(this.element);
                }
                this._menuElement.innerHTML = "";
                for (var i = 0; i < this._menuItems.length; i++) {
                    this._menuElement.appendChild(this._menuItems[i].element);
                    this._menuItems[i].invalidate();
                }
            };
            ToolbarMenu.prototype.createElement = function () {
                var element = document.createElement("div");
                element.classList.add("toolbarMenuContainer");
                this._menuElement = this.createMenuElement(element);
                return element;
            };
            ToolbarMenu.prototype.createMenuElement = function (parentElement) {
                var element = document.createElement("ul");
                element.classList.add("toolbarMenu");
                parentElement.appendChild(element);
                return element;
            };
            return ToolbarMenu;
        }(Controls.Control));
        Controls.ToolbarMenu = ToolbarMenu;
    })(Controls = MapBuilder.Controls || (MapBuilder.Controls = {}));
})(MapBuilder || (MapBuilder = {}));
var MapBuilder;
(function (MapBuilder) {
    var Controls;
    (function (Controls) {
        var ToolbarMenuItem = /** @class */ (function (_super) {
            __extends(ToolbarMenuItem, _super);
            function ToolbarMenuItem(label, shortKeys) {
                var _this = _super.call(this) || this;
                _this._subItems = [];
                _this._isEnabled = true;
                _this.onMouseDown = function (event) {
                    if (_this._subItems.length > 0) {
                        if (!_this.element.classList.contains("toolbarMenu__item--opened")) {
                            _this.element.classList.add("toolbarMenu__item--opened");
                        }
                        else {
                            _this.element.classList.remove("toolbarMenu__item--opened");
                        }
                    }
                };
                _this.onClick = function (event) {
                    if (_this._subItems.length === 0) {
                        var parent_1 = _this.element.parentElement;
                        while (parent_1 && !parent_1.classList.contains("toolbarMenu")) {
                            if (parent_1.classList.contains("toolbarMenu__item--opened")) {
                                parent_1.classList.remove("toolbarMenu__item--opened");
                            }
                            parent_1 = parent_1.parentElement;
                        }
                    }
                    if (_this._clickHandler) {
                        _this._clickHandler.apply(event);
                    }
                };
                _this.onMouseOver = function (event) {
                    var parent = _this.element.parentElement;
                    if (!_this.element.classList.contains("toolbarMenu__item--opened")
                        && (parent.classList.contains("toolbarMenu") || parent.classList.contains("toolbarMenu__subMenu"))) {
                        var open_1 = false;
                        if (parent.classList.contains("toolbarMenu__subMenu")) {
                            open_1 = _this._subItems.length > 0;
                        }
                        else {
                            for (var i = 0; i < parent.children.length; i++) {
                                var child = parent.children[i];
                                if (child === _this.element) {
                                    continue;
                                }
                                if (child.classList.contains("toolbarMenu__item--opened")) {
                                    open_1 = true;
                                    child.classList.remove("toolbarMenu__item--opened");
                                }
                            }
                        }
                        if (open_1) {
                            _this.element.classList.add("toolbarMenu__item--opened");
                        }
                    }
                };
                _this.onMouseOut = function (event) {
                    var parent = _this.element.parentElement;
                    if (_this.element.classList.contains("toolbarMenu__item--opened") && parent.classList.contains("toolbarMenu__subMenu")) {
                        _this.element.classList.remove("toolbarMenu__item--opened");
                    }
                };
                _this.onDocumentMouseDown = function (event) {
                    if (!_this.element) {
                        return;
                    }
                    var target = event.target;
                    if (target !== _this.element && !_this.element.contains(target)
                        && _this.element.classList.contains("toolbarMenu__item--opened")) {
                        _this.element.classList.remove("toolbarMenu__item--opened");
                    }
                };
                _this._label = label;
                _this._shortKeys = shortKeys;
                return _this;
            }
            Object.defineProperty(ToolbarMenuItem.prototype, "controls", {
                get: function () {
                    throw new Error("Child controls are not supported on ToolbarMenuItem, use `addChildItem(menuItem: ToolbarMenuItem)` instead.");
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ToolbarMenuItem.prototype, "label", {
                get: function () {
                    return this._label;
                },
                set: function (label) {
                    this._label = label;
                    this.invalidate();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ToolbarMenuItem.prototype, "shortKeys", {
                get: function () {
                    return this._shortKeys;
                },
                set: function (shortKeys) {
                    this._shortKeys = shortKeys;
                    this.invalidate();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ToolbarMenuItem.prototype, "clickHandler", {
                get: function () {
                    return this._clickHandler;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ToolbarMenuItem.prototype, "subItems", {
                get: function () {
                    return this._subItems.slice();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ToolbarMenuItem.prototype, "isEnabled", {
                get: function () {
                    return this._isEnabled;
                },
                set: function (isEnabled) {
                    this._isEnabled = isEnabled;
                    this.invalidate();
                },
                enumerable: true,
                configurable: true
            });
            ToolbarMenuItem.prototype.setLabel = function (label) {
                this.label = label;
                return this;
            };
            ToolbarMenuItem.prototype.setShortKeys = function (shortKeys) {
                this.shortKeys = shortKeys;
                return this;
            };
            ToolbarMenuItem.prototype.disable = function () {
                this.isEnabled = false;
                return this;
            };
            ToolbarMenuItem.prototype.setClickHandler = function (clickHandler) {
                this._clickHandler = clickHandler;
                return this;
            };
            ToolbarMenuItem.prototype.addSubItem = function (menuItem) {
                this._subItems.push(menuItem);
                this.invalidate();
                return this;
            };
            ToolbarMenuItem.prototype.onInvalidate = function () {
                if (!this._isEnabled && !this.element.classList.contains("toolbarMenu__item--disabled")) {
                    this.element.classList.add("toolbarMenu__item--disabled");
                }
                else if (this._isEnabled && this.element.classList.contains("toolbarMenu__item--disabled")) {
                    this.element.classList.remove("toolbarMenu__item--disabled");
                }
                if ((this._label || this._shortKeys) && !this._labelElement) {
                    this._labelElement = this.createLabelElement(this.element);
                }
                if (this._label === "-") {
                    this._labelElement.innerText = "";
                    if (!this.element.classList.contains("toolbarMenu__item--divider")) {
                        this.element.classList.add("toolbarMenu__item--divider");
                    }
                }
                else {
                    // TODO: ShortKey not showing?
                    this._labelElement.innerText = this._label;
                    if (this.element.classList.contains("toolbarMenu__item--divider")) {
                        this.element.classList.remove("toolbarMenu__item--divider");
                    }
                }
                if (this._shortKeys) {
                    var shortKeysString = "";
                    for (var i = 0; i < this._shortKeys.length; i++) {
                        if (shortKeysString) {
                            shortKeysString += "+";
                        }
                        shortKeysString += MapBuilder.KeysStringHelper.toString(this._shortKeys[i]);
                    }
                    if (shortKeysString) {
                        if (!this._shortKeysElement) {
                            this._shortKeysElement = this.createShortKeysElement(this._labelElement);
                        }
                        this._shortKeysElement.innerText = shortKeysString;
                        this._labelElement.appendChild(this._shortKeysElement);
                    }
                }
                if (this._subItems.length > 0) {
                    if (!this._subMenuElement) {
                        this._subMenuElement = this.createSubMenuElement(this.element);
                    }
                    if (!this.element.classList.contains("toolbarMenu__item--hasSubMenu")) {
                        this.element.classList.add("toolbarMenu__item--hasSubMenu");
                    }
                    this._subMenuElement.innerHTML = "";
                    for (var i = 0; i < this._subItems.length; i++) {
                        this._subMenuElement.appendChild(this._subItems[i].element);
                        this._subItems[i].invalidate();
                    }
                }
                else {
                    if (this.element.classList.contains("toolbarMenu__item--hasSubMenu")) {
                        this.element.classList.remove("toolbarMenu__item--hasSubMenu");
                    }
                }
            };
            ToolbarMenuItem.prototype.createElement = function () {
                var element = document.createElement("li");
                element.classList.add("toolbarMenu__item");
                element.addEventListener("mouseover", this.onMouseOver);
                element.addEventListener("mouseout", this.onMouseOut);
                if (this._label) {
                    this._labelElement = this.createLabelElement(element);
                }
                document.addEventListener("mousedown", this.onDocumentMouseDown);
                return element;
            };
            ToolbarMenuItem.prototype.createLabelElement = function (parentElement) {
                var element = document.createElement("span");
                element.classList.add("toolbarMenu__itemLabel");
                element.addEventListener("mousedown", this.onMouseDown);
                element.addEventListener("click", this.onClick);
                if (this._shortKeys) {
                    this._shortKeysElement = this.createShortKeysElement(element);
                }
                parentElement.appendChild(element);
                return element;
            };
            ToolbarMenuItem.prototype.createShortKeysElement = function (parentElement) {
                var element = document.createElement("span");
                element.classList.add("toolbarMenu__itemShortKeys");
                parentElement.appendChild(element);
                return element;
            };
            ToolbarMenuItem.prototype.createSubMenuElement = function (parentElement) {
                var element = document.createElement("ul");
                element.classList.add("toolbarMenu__subMenu");
                parentElement.appendChild(element);
                return element;
            };
            return ToolbarMenuItem;
        }(Controls.Control));
        Controls.ToolbarMenuItem = ToolbarMenuItem;
    })(Controls = MapBuilder.Controls || (MapBuilder.Controls = {}));
})(MapBuilder || (MapBuilder = {}));
