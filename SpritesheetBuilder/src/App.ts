/// <reference path="../typings/color-picker.d.ts" />

module SpritesheetBuilder {
    interface IGlobalProperties {
        rasterItemWidth?: number;
        rasterItemHeight?: number;
        rasterColor?: string;
        rasterAlpha?: number;
    }

    export class App {
        private leftPaneBody: HTMLElement;
        private editorPaneBody: HTMLElement;
        private propertiesPaneBody: HTMLElement;

        private globalProperties: IGlobalProperties = {};
        private transparentBackgroundImage: HTMLImageElement;
        private texturesCanvas: HTMLCanvasElement;
        private currentTexture: HTMLImageElement;

        private isCtrlPressed: boolean = false;
        private scale: number = 1.0;

        public constructor(private leftPane: HTMLElement, private editorPane: HTMLElement, private propertiesPane: HTMLElement) {
            this.leftPaneBody = <HTMLElement>leftPane.getElementsByClassName("pane__body")[0];
            this.editorPaneBody = <HTMLElement>editorPane.getElementsByClassName("pane__body")[0];
            this.propertiesPaneBody = <HTMLElement>propertiesPane.getElementsByClassName("pane__body")[0];
        }

        public initialize() {
            this.initTexturesOverview();
            window.onresize = this.onWindowResize;
            window.onmousedown = this.onWindowMouseDown;
            window.onmouseup = this.onWindowMouseUp;
            window.onmousemove = this.onWindowMouseMove;
            window.onkeydown = this.onWindowKeyDown;
            window.onkeyup = this.onWindowKeyUp;
            this.editorPaneBody.addEventListener("wheel", this.onEditorWheel);
            
            this.transparentBackgroundImage = new Image();
            this.transparentBackgroundImage.src = Constants.ResourcesPath + "/TransparentBackground.png";
        }

        public initTexturesOverview() {
            this.clearPane(this.editorPaneBody);
            
            const w: IAppSpecificWindowVariables = <any>window;
            if (!w.availableSpritesheetTextures || w.availableSpritesheetTextures.length === 0) {
                this.editorPaneBody.innerHTML = "<p>No textures found</p>";
                return;
            }

            const list = document.createElement("ul");
            list.className = "texturesList";

            let currentSelectedItem = null;

            for (var i=0; i<w.availableSpritesheetTextures.length; i++) {
                const textureFile = w.availableSpritesheetTextures[i];

                const listItem = document.createElement("li");
                listItem.className = "texturesList__item";
                listItem.addEventListener("click", () => {
                    currentSelectedItem = listItem;

                    for (var n=0; n<list.children.length; n++) {
                        list.children[0].className = "texturesList__item";
                    }

                    currentSelectedItem.className = "texturesList__item texturesList__item--active";
                });
                listItem.addEventListener("dblclick", () => {
                    this.newSpritesheet(textureFile);
                });
                
                const thumbnail = document.createElement("div");
                thumbnail.className = "texturesList__itemThumbnail"
                const img = document.createElement("img");
                img.src = Constants.TexturesPath + "/" + textureFile;

                const label = document.createElement("label");
                label.className = "texturesList__itemLabel";
                label.innerText = textureFile;

                thumbnail.appendChild(img);
                listItem.appendChild(thumbnail);
                listItem.appendChild(label);
                list.appendChild(listItem);
            }

            this.editorPaneBody.appendChild(list);
        }

        public newSpritesheet(textureFile?: string) {
            this.clearPane(this.editorPaneBody);
            this.clearPane(this.propertiesPaneBody);

            const globalProperties = document.createElement("div");
            globalProperties.className = "properties properties--global";

            const title = document.createElement("h3");
            title.innerText = "Global Properties";
            globalProperties.appendChild(title);

            globalProperties.appendChild(this.createPropertiesItem(this.globalProperties, "editorMode", "Editor Mode", PropertyFieldTypes.Select, [["Spritesheet Map", EditorModes.SpritesheetMap, true], ["Tileset Map", EditorModes.TilesetMap]], (v) => this.invalidateTexturesCanvas()));
            globalProperties.appendChild(this.createPropertiesItem(this.globalProperties, "rasterItemWidth", "Raster Item Width", PropertyFieldTypes.Number, 32, (v) => this.invalidateTexturesCanvas()));
            globalProperties.appendChild(this.createPropertiesItem(this.globalProperties, "rasterItemHeight", "Raster Item Height", PropertyFieldTypes.Number, 32, (v) => this.invalidateTexturesCanvas()));
            globalProperties.appendChild(this.createPropertiesItem(this.globalProperties, "rasterColor", "Raster Color", PropertyFieldTypes.ColorPicker, "000000", (v) => this.invalidateTexturesCanvas()));
            globalProperties.appendChild(this.createPropertiesItem(this.globalProperties, "rasterAlpha", "Raster Alpha", PropertyFieldTypes.Number, 0.5, (v) => this.invalidateTexturesCanvas()));

            this.propertiesPaneBody.appendChild(globalProperties);

            this.texturesCanvas = document.createElement("canvas");
            this.texturesCanvas.className = "texturesCanvas";
            this.editorPaneBody.appendChild(this.texturesCanvas);

            if (textureFile) {
                // TODO: Load with ajax
                const image = new Image();
                image.addEventListener("load", () => {
                    this.currentTexture = image;

                    this.editorPaneBody.dataset.scrollX = Math.round((this.editorPaneBody.clientWidth - image.width) / 2).toString();
                    this.editorPaneBody.dataset.scrollY = Math.round((this.editorPaneBody.clientHeight - image.height) / 2).toString();

                    this.invalidateTexturesCanvas();
                });
                image.src = Constants.TexturesPath + "/" + textureFile;
            }
        }

        private clearPane(pane: HTMLElement) {
            pane.innerHTML = "";
        }

        private createPropertiesItem(propertiesObj: any, name: string, label: string, fieldType: PropertyFieldTypes, defaultValue?: any, onValueChanged?: (newValue: any) => void): HTMLElement {
            const value = typeof propertiesObj[name] !== "undefined" && propertiesObj[name] !== null ? propertiesObj[name] : defaultValue;
            propertiesObj[name] = value;
            console.log(value);

            const row = document.createElement("p");
            row.className = "properties__row";

            const labelEl = document.createElement("label");
            labelEl.className = "properties__label";
            labelEl.innerText = label;

            const field = document.createElement("div");
            field.className = "properties__field";

            switch (fieldType) {
                case PropertyFieldTypes.Text:
                case PropertyFieldTypes.Number:
                case PropertyFieldTypes.ColorPicker:
                    field.className += " properties__field--" + fieldType;

                    const input = document.createElement("input");
                    input.name = name;
                    input.id = "properties__" + name;
                    input.type = fieldType === PropertyFieldTypes.Number ? "number" : "text";

                    if (typeof value !== "undefined" && value !== null) {
                        input.value = value;
                    }

                    input.addEventListener("change", (e) => {
                        propertiesObj[name] = input.value;

                        if (onValueChanged) {
                            onValueChanged(input.value);
                        }
                    });

                    field.appendChild(input);

                    if (fieldType === PropertyFieldTypes.ColorPicker) {
                        let colorPicker = new CP(input);
                        colorPicker.on("change", (color: string) => {
                            if (color.length === 3 || color.length === 6) {
                                color = "#" + color;
                            }

                            input.value = color;
                            propertiesObj[name] = input.value;

                            if (onValueChanged) {
                                onValueChanged(input.value);
                            }
                        });
                    }

                    break;

                case PropertyFieldTypes.Select:
                    field.className += " properties__field--select";

                    const selectBox = document.createElement("select");
                    selectBox.name = name;
                    selectBox.id = "properties__" + name;
                    
                    if (typeof value !== "undefined" && value !== null && value.length > 0) {
                        for (let i=0; i<value.length; i++) {
                            const item = value[i];

                            const itemLabel = item[0];
                            const itemValue = typeof item[1] !== "undefined" ? item[1] : itemLabel;
                            const itemSelected = item[2] || false;

                            const option = document.createElement("option");
                            option.value = itemValue;
                            option.innerText = itemLabel;

                            if (itemSelected) {
                                option.selected = true;
                            }

                            selectBox.appendChild(option);
                        }
                    }

                    selectBox.addEventListener("change", (e) => {
                        propertiesObj[name] = selectBox.value;

                        if (onValueChanged) {
                            onValueChanged(selectBox.value);
                        }
                    });

                    field.appendChild(selectBox);
                    break;
            }

            row.appendChild(labelEl);
            row.appendChild(field);

            return row;
        }

        private invalidateTexturesCanvas() {
            if (!this.currentTexture) {
                return;
            }

            this.texturesCanvas.width = this.editorPaneBody.clientWidth;
            this.texturesCanvas.height = this.editorPaneBody.clientHeight;

            const centerPaneWidth = this.editorPaneBody.clientWidth;
            const centerPaneHeight = this.editorPaneBody.clientHeight;

            const maxX = Math.min(centerPaneWidth / this.globalProperties.rasterItemWidth, this.currentTexture.width / this.globalProperties.rasterItemWidth);
            const maxY = Math.min(centerPaneHeight / this.globalProperties.rasterItemHeight, this.currentTexture.height / this.globalProperties.rasterItemHeight);

            var scrollX = parseFloat(this.editorPaneBody.dataset.scrollX);
            var scrollY = parseFloat(this.editorPaneBody.dataset.scrollY);

            const context = this.texturesCanvas.getContext("2d");
            context.imageSmoothingEnabled = false;

            context.translate(scrollX, scrollY);
            //context.scale(this.zoomFactor, this.zoomFactor);

            context.clearRect(0, 0, this.texturesCanvas.width, this.texturesCanvas.height);
            context.save();
            let pattern = context.createPattern(this.transparentBackgroundImage, "repeat");
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
            for (var y=0; y<maxY; y++) {
                for (var x=0; x<maxX; x++) {
                    context.rect(
                        x * this.globalProperties.rasterItemWidth * this.scale,
                        y * this.globalProperties.rasterItemHeight * this.scale,
                        this.globalProperties.rasterItemWidth * this.scale,
                        this.globalProperties.rasterItemHeight * this.scale);
                }
            }

            context.stroke();
            context.restore();
        }

        private onWindowResize = () => {
            this.invalidateTexturesCanvas();
        }

        private onWindowMouseDown = (e: MouseEvent) => {
            if (e.target !== this.editorPaneBody && !this.editorPaneBody.contains(<Node>e.target)) {
                return true;
            }

            if(e.stopPropagation) e.stopPropagation();
            if(e.preventDefault) e.preventDefault();
            e.cancelBubble=true;
            e.returnValue=false;
            
            this.editorPaneBody.dataset.mouseDown = "true";

            var mouseX = e.pageX - this.editorPaneBody.offsetLeft;
            var mouseY = e.pageY - this.editorPaneBody.offsetTop;

            this.editorPaneBody.dataset.startPointMouseX = mouseX.toString();
            this.editorPaneBody.dataset.startPointMouseY = mouseY.toString();

            this.editorPaneBody.dataset.startPointScrollX = this.editorPaneBody.dataset.scrollX;
            this.editorPaneBody.dataset.startPointScrollY = this.editorPaneBody.dataset.scrollY;

            return false;
        }

        private onWindowMouseUp = (e: MouseEvent) => {
            this.editorPaneBody.dataset.mouseDown = "false";
        }

        private onWindowMouseMove = (e: MouseEvent) => {
            if (this.editorPaneBody.dataset.mouseDown === "true") {
                var startPointMouseX = parseFloat(this.editorPaneBody.dataset.startPointMouseX);
                var startPointMouseY = parseFloat(this.editorPaneBody.dataset.startPointMouseY);
                var startPointScrollX = parseFloat(this.editorPaneBody.dataset.startPointScrollX);
                var startPointScrollY = parseFloat(this.editorPaneBody.dataset.startPointScrollY);

                var offsetX = e.pageX - this.editorPaneBody.offsetLeft - startPointMouseX;
                var offsetY = e.pageY - this.editorPaneBody.offsetTop - startPointMouseY;

                var scrollX = Math.round(startPointScrollX + offsetX);
                var scrollY = Math.round(startPointScrollY + offsetY);

                this.editorPaneBody.dataset.scrollX = scrollX.toString();
                this.editorPaneBody.dataset.scrollY = scrollY.toString();

                setTimeout(() => this.invalidateTexturesCanvas());
            }
        }

        private onWindowKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey) {
                this.isCtrlPressed = true;
            }
        }

        private onWindowKeyUp = (e: KeyboardEvent) => {
            if (e.ctrlKey) {
                this.isCtrlPressed = false;
            }
        }

        private onEditorWheel = (e: WheelEvent) => {
            if (this.isCtrlPressed) {
                e.preventDefault();

                this.scale += 0.1;
                this.invalidateTexturesCanvas();
            }
        }
    }
}