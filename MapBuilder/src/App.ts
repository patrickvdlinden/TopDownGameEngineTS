/// <reference path="../typings/color-picker.d.ts" />

module MapBuilder {
    interface IGlobalProperties {
        rasterItemWidth?: number;
        rasterItemHeight?: number;
        rasterColor?: string;
        rasterAlpha?: number;
    }

    export class App {
        private container: HTMLElement;
        private toolbarMenu: Controls.ToolbarMenu;

        private splitContainer: Controls.SplitContainer;
        private leftPane: Controls.Pane;
        private startPane: Controls.Pane;
        private editorPane: Controls.Pane;
        private propertiesPane: Controls.Pane;

        private globalProperties: IGlobalProperties = {};
        private transparentBackgroundImage: HTMLImageElement;
        private texturesCanvas: HTMLCanvasElement;
        private currentTexture: HTMLImageElement;

        private isCtrlPressed: boolean = false;
        private scaleIndex: number = 7;
        private scale: number = 1.0;

        private isDirty: boolean = false;

        private appContainer: Controls.AppContainer;
        private newMenuItem: Controls.ToolbarMenuItem;
        private aboutModal: Controls.Modal;

        public constructor(container: HTMLElement) {
            this.container = container;
        }

        public initialize() {
            this.appContainer = new Controls.AppContainer();
            document.body.insertBefore(this.appContainer.element, document.body.childNodes[0]);

            this.buildToolbar();

            this.startPane = new Controls.Pane("Start");
            this.startPane.dockMode = Controls.DockMode.All;

            this.appContainer.pane.controls.add(this.startPane);

            this.initTexturesOverview();
            window.onresize = this.onWindowResize;
            window.onmousedown = this.onWindowMouseDown;
            window.onmouseup = this.onWindowMouseUp;
            window.onmousemove = this.onWindowMouseMove;
            window.onkeydown = this.onWindowKeyDown;
            window.onkeyup = this.onWindowKeyUp;
            
            this.transparentBackgroundImage = new Image();
            this.transparentBackgroundImage.src = Constants.ResourcesPath + "/TransparentBackground.png";
        }

        protected onNewMenuItemClick = (e: MouseEvent): void => {
            if (this.isDirty && !confirm("There are unsaved changes. Are you sure you want to continue?")) {
                return;
            }

            this.newProject();
        }

        protected onOpenMenuItemClick = (e: MouseEvent): void => {
            if (this.isDirty && !confirm("There are unsaved changes. Are you sure you want to continue?")) {
                return;
            }
        }

        protected onSaveMenuItemClick = (e: MouseEvent): void => {
        }

        protected onSaveAsMenuItemClick = (e: MouseEvent): void => {
        }

        protected onSettingsMenuItemClick = (e: MouseEvent): void => {
        }

        protected onCloseMenuItemClick = (e: MouseEvent): void => {
            if (this.isDirty && !confirm("There are unsaved changes. Are you sure you want to continue?")) {
                return;
            }
        }

        public initTexturesOverview() {
            this.startPane.bodyElement.innerHTML = "";

            const w: IAppSpecificWindowVariables = <any>window;
            if (!w.availableSpritesheetTextures || w.availableSpritesheetTextures.length === 0) {
                this.startPane.bodyElement.innerHTML = "<p>No textures found</p>";
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
                    this.newProject(textureFile);
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

            this.startPane.bodyElement.appendChild(list);
        }

        public newProject(textureFile?: string) {
            this.appContainer.pane.controls.remove(this.startPane);

            this.splitContainer = new Controls.SplitContainer();

            this.editorPane = new Controls.EditorPane("Editor");
            this.propertiesPane = new Controls.Pane("Properties");
            this.leftPane = new Controls.Pane("Left Pane");

            //this.splitContainer.panes.add(this.leftPane);
            this.splitContainer.panes.add(this.leftPane);
            this.splitContainer.panes.add(this.editorPane);
            this.splitContainer.panes.add(this.propertiesPane);

            this.appContainer.pane.controls.add(this.splitContainer);
            this.splitContainer.setSplitterPositionFor(0, 25);
            this.splitContainer.setSplitterPositionFor(1, 75);

            this.editorPane.bodyElement.innerHTML = "";

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

            this.propertiesPane.bodyElement.appendChild(globalProperties);

            this.texturesCanvas = document.createElement("canvas");
            this.texturesCanvas.className = "texturesCanvas";
            this.editorPane.bodyElement.appendChild(this.texturesCanvas);

            if (textureFile) {
                // TODO: Load with ajax
                const image = new Image();
                image.addEventListener("load", () => {
                    this.currentTexture = image;

                    this.editorPane.element.dataset.scrollX = Math.round((this.editorPane.element.clientWidth - image.width) / 2).toString();
                    this.editorPane.element.dataset.scrollY = Math.round((this.editorPane.element.clientHeight - image.height) / 2).toString();

                    this.invalidateTexturesCanvas();
                });
                image.src = Constants.TexturesPath + "/" + textureFile;
            }
        }

        private buildToolbar(): void {
            this.toolbarMenu = new Controls.ToolbarMenu();

            let fileMenuItem = new Controls.ToolbarMenuItem("File");
            this.newMenuItem = new Controls.ToolbarMenuItem("New", [Keys.Control, Keys.N]).setClickHandler(this.onNewMenuItemClick)

            fileMenuItem
                .addSubItem(this.newMenuItem)
                .addSubItem(new Controls.ToolbarMenuItem("-"))
                .addSubItem(new Controls.ToolbarMenuItem("Open...").setClickHandler(this.onOpenMenuItemClick))
                .addSubItem(
                    new Controls.ToolbarMenuItem("Open recent")
                        .addSubItem(new Controls.ToolbarMenuItem("Luffy.png")))
                .addSubItem(new Controls.ToolbarMenuItem("-"))
                .addSubItem(new Controls.ToolbarMenuItem("Save").disable().setClickHandler(this.onSaveMenuItemClick))
                .addSubItem(new Controls.ToolbarMenuItem("Save as...").disable().setClickHandler(this.onSaveAsMenuItemClick))
                .addSubItem(new Controls.ToolbarMenuItem("-"))
                .addSubItem(new Controls.ToolbarMenuItem("Settings").setClickHandler(this.onSettingsMenuItemClick))
                .addSubItem(new Controls.ToolbarMenuItem("-"))
                .addSubItem(new Controls.ToolbarMenuItem("Close").setClickHandler(this.onCloseMenuItemClick));

            this.toolbarMenu
                .addMenuItem(fileMenuItem)
                .addMenuItem(
                    new Controls.ToolbarMenuItem("Edit")
                        .addSubItem(new Controls.ToolbarMenuItem("Undo",[Keys.Control, Keys.Z]).disable())
                        .addSubItem(new Controls.ToolbarMenuItem("Redo", [Keys.Control, Keys.Shift, Keys.Z]).disable()))
                .addMenuItem(new Controls.ToolbarMenuItem("View"))
                .addMenuItem(new Controls.ToolbarMenuItem("Help").addSubItem(new Controls.ToolbarMenuItem("About").setClickHandler(this.onAboutMenuItemClick)));
            this.appContainer.toolbarMenu = this.toolbarMenu;
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

            this.texturesCanvas.width = this.editorPane.element.clientWidth;
            this.texturesCanvas.height = this.editorPane.element.clientHeight;

            const centerPaneWidth = this.editorPane.element.clientWidth;
            const centerPaneHeight = this.editorPane.element.clientHeight;

            const maxX = Math.min(centerPaneWidth / this.globalProperties.rasterItemWidth, this.currentTexture.width / this.globalProperties.rasterItemWidth);
            const maxY = Math.min(centerPaneHeight / this.globalProperties.rasterItemHeight, this.currentTexture.height / this.globalProperties.rasterItemHeight);

            var scrollX = parseFloat(this.editorPane.element.dataset.scrollX);
            var scrollY = parseFloat(this.editorPane.element.dataset.scrollY);

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

            this.editorPane.title = "Editor Pane (" + (this.scale * 100) + "%)";
        }

        private onWindowResize = () => {
            this.invalidateTexturesCanvas();
        }

        private onWindowMouseDown = (e: MouseEvent) => {
            if (!this.editorPane) {
                return true;
            }

            if (e.target !== this.editorPane.element && !this.editorPane.element.contains(<Node>e.target)) {
                return true;
            }

            if(e.stopPropagation) e.stopPropagation();
            if(e.preventDefault) e.preventDefault();
            e.cancelBubble=true;
            e.returnValue=false;
            
            this.editorPane.element.dataset.mouseDown = "true";

            var mouseX = e.pageX - this.editorPane.element.offsetLeft;
            var mouseY = e.pageY - this.editorPane.element.offsetTop;

            this.editorPane.element.dataset.startPointMouseX = mouseX.toString();
            this.editorPane.element.dataset.startPointMouseY = mouseY.toString();

            this.editorPane.element.dataset.startPointScrollX = this.editorPane.element.dataset.scrollX;
            this.editorPane.element.dataset.startPointScrollY = this.editorPane.element.dataset.scrollY;

            return false;
        }

        private onWindowMouseUp = (e: MouseEvent) => {
            if (!this.editorPane) {
                return;
            }

            this.editorPane.element.dataset.mouseDown = "false";
        }

        private onWindowMouseMove = (e: MouseEvent) => {
            if (!this.editorPane) {
                return;
            }

            if (this.editorPane.element.dataset.mouseDown === "true") {
                var startPointMouseX = parseFloat(this.editorPane.element.dataset.startPointMouseX);
                var startPointMouseY = parseFloat(this.editorPane.element.dataset.startPointMouseY);
                var startPointScrollX = parseFloat(this.editorPane.element.dataset.startPointScrollX);
                var startPointScrollY = parseFloat(this.editorPane.element.dataset.startPointScrollY);

                var offsetX = e.pageX - this.editorPane.element.offsetLeft - startPointMouseX;
                var offsetY = e.pageY - this.editorPane.element.offsetTop - startPointMouseY;

                var scrollX = Math.round(startPointScrollX + offsetX);
                var scrollY = Math.round(startPointScrollY + offsetY);

                this.editorPane.element.dataset.scrollX = scrollX.toString();
                this.editorPane.element.dataset.scrollY = scrollY.toString();

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

                console.log(e.deltaX, e.deltaY, e.deltaZ);
                if (e.deltaY < 0) {
                    // zoom in
                    this.scaleIndex++;
                    if (this.scaleIndex >= Constants.zoomScales.length) {
                        this.scaleIndex = Constants.zoomScales.length - 1;
                    }

                    this.scale = Constants.zoomScales[this.scaleIndex];
                } else {
                    // zoom out
                    this.scaleIndex--;
                    if (this.scaleIndex < 0) {
                        this.scaleIndex = 0;
                    }

                    this.scale = Constants.zoomScales[this.scaleIndex];
                }
                //this.scale -= (e.deltaY / 100);
                
                // if (Math.abs(this.scale) < 0.1) {
                //     this.scale = -this.scale;
                // }

                this.invalidateTexturesCanvas();
            }
        }

        private onAboutMenuItemClick = (event: MouseEvent): any => {
            if (!this.aboutModal) {
                this.aboutModal = new Controls.Modal("About");
                this.aboutModal.body = "<p>v1.0.0</p>";
            }

            this.aboutModal.open();
            this.appContainer.pane.controls.add(this.aboutModal);
        }
    }
}