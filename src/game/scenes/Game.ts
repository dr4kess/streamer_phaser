import { EventBus } from '../EventBus';
import Phaser from 'phaser';

export default class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        EventBus.emit('current-scene-ready', this);

        // Add floor and walls (non-draggable objects)
        const room_floor = this.add.image(200, 224, 'room_floor').setPipeline('Light2D').setScale(0.55);
        const room_walls = this.add.image(200, 146, 'room_wall').setPipeline('Light2D').setScale(0.55);

        // Enable lighting system
        this.lights.enable().setAmbientColor(0x555555);

        // Define floor polygon boundaries
        const floorPolygon = new Phaser.Geom.Polygon([
            { x: 20, y: 221 },   // Left-Mid Corner
            { x: 130, y: 165 },  // Left-Top Corner
            { x: 162, y: 178 },  // Mid-Top Corner
            { x: 239, y: 142 },  // Right-Top Corner
            { x: 380, y: 214 },  // Right-Mid Corner
            { x: 193, y: 308 }   // Mid-Bottom Corner
        ]);

        // Create draggable objects
        const lamp1 = this.createLampWithLight(155, 220);
        const lamp2 = this.createLampWithLight(240, 170);
        const sofa = this.add.image(180, 250, 'sofa').setPipeline('Light2D').setOrigin(0.5).setScale(0.45);

        this.draggableObjects = [sofa, lamp1, lamp2];

        // Enable keyboard events to toggle dragging
        this.input.keyboard.on('keydown-T', () => this.toggleDragging(true, floorPolygon));
        this.input.keyboard.on('keydown-Y', () => this.toggleDragging(false));

        // Initially disable dragging
        this.toggleDragging(false);
    }

    createLampWithLight(x, y) {
        const lamp = this.add.image(x, y, 'lamp').setPipeline('Light2D').setOrigin(0.5, 1).setScale(0.55);
        const lampLight = this.lights.addLight(x, y - (lamp.displayHeight * lamp.scaleY) / 2, 150)
            .setColor(0xfff1e8)
            .setIntensity(0.9);

        lamp.light = lampLight;
        return lamp;
    }

    makeDraggable(obj, floorPolygon) {
        obj.setInteractive({ draggable: true });
        this.input.setDraggable(obj);

        obj.on('drag', (pointer, dragX, dragY) => {
            // Get the corners of the object at the new position
            const corners = this.getObjectCorners(obj, dragX, dragY);

            // Ensure all corners are inside the floorPolygon
            const allCornersInside = corners.every(corner =>
                Phaser.Geom.Polygon.Contains(floorPolygon, corner.x, corner.y)
            );

            if (allCornersInside) {
                // Allow movement if inside
                obj.x = dragX;
                obj.y = dragY;
                this.updateObjectPosition(obj);
            }
        });
    }

    getObjectCorners(obj, x, y) {
        const halfWidth = (obj.displayWidth * obj.scaleX) / 2;
        const halfHeight = (obj.displayHeight * obj.scaleY) / 2;

        return [
            { x: x - halfWidth, y: y - halfHeight }, // Top-left
            { x: x + halfWidth, y: y - halfHeight }, // Top-right
            { x: x - halfWidth, y: y + halfHeight }, // Bottom-left
            { x: x + halfWidth, y: y + halfHeight }  // Bottom-right
        ];
    }

    updateObjectPosition(obj) {
        if (obj.light) {
            obj.light.x = obj.x;
            obj.light.y = obj.y - (obj.displayHeight * obj.scaleY) / 2;
        }
    }

    toggleDragging(enable, floorPolygon = null) {
        if (enable) {
            // Enable dragging and make objects interactive
            this.draggableObjects.forEach(obj => this.makeDraggable(obj, floorPolygon));
        } else {
            // Disable dragging and remove interactivity
            this.draggableObjects.forEach(obj => obj.disableInteractive());
        }
    }
}
