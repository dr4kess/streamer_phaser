import { EventBus } from '../EventBus';

export default class Game extends Phaser.Scene {
    constructor() {
        super("Game");
    }

    editorCreate(): void {
        this.events.emit("scene-awake");
    }

    create() {
        this.editorCreate();

        // Add floor
              const room_floor_glow = this.add.image(200, 223.5, 'glow').setOrigin(0.5).setScale(0.6).setAlpha(1);
              const room_floor = this.add.image(200, 224, "room_floor").setPipeline('Light2D').setScale(0.55);
              const room_walls = this.add.image(200, 146, "room_wall").setPipeline('Light2D').setScale(0.55);
              // const sofa = this.add.image(140, 230, "sofa").setPipeline('Light2D').setScale(0.55);

        // Enable lighting system
        this.lights.enable().setAmbientColor(0x555555);

        // Define floor polygon boundaries (pseudo 3D angled floor shape)
        const floorPolygon = new Phaser.Geom.Polygon([
            { x: 5, y: 221 },    // Left-Mid Corner
            { x: 126, y: 160 },  // Left-Top Corner
            { x: 162, y: 178 },  // Mid-Top Corner
            { x: 241, y: 138 },  // Right-Top Corner
            { x: 392.5, y: 214 }, // Right-Mid Corner
            { x: 195, y: 312 }   // Mid-Bottom Corner
        ]);

        // Visualize the floor polygon
        const graphics = this.add.graphics({ fillStyle: { color: 0x00ff00, alpha: 0.3 } });
        graphics.fillPoints(floorPolygon.points, true);

        // Create draggable lamps restricted to the floor polygon
        const lamp1 = this.createLampWithLight(125, 190);
        const lamp2 = this.createLampWithLight(240, 170);
        lamp1.setScale(0.55);
        lamp2.setScale(0.55);

        this.makeLampDraggable(lamp1, floorPolygon);
        this.makeLampDraggable(lamp2, floorPolygon);

        EventBus.emit('current-scene-ready', this);
    }

    createLampWithLight(x, y) {
        const lamp = this.add.image(x, y, 'lamp').setPipeline('Light2D').setOrigin(0.5, 1); // Align to bottom-center

        const lampLight = this.lights.addLight(x, y - (lamp.displayHeight * lamp.scaleY) / 2, 150)
            .setColor(0xfff1e8)  // Warm light color
            .setIntensity(0.9);  // Light intensity

        // Create a border around the lamp
        this.drawLampBorder(lamp);

        lamp.light = lampLight;
        return lamp;
    }

    drawLampBorder(lamp) {
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0xff0000, 0.8);  // Red border with 80% opacity

        // Calculate the lamp's size (with scaling)
        const lampWidth = lamp.displayWidth * lamp.scaleX;
        const lampHeight = lamp.displayHeight * lamp.scaleY;

        // Draw the border as a rectangle around the lamp
        graphics.strokeRect(
            lamp.x - lampWidth / 2,  // Top-left X
            lamp.y - lampHeight,     // Top-left Y (because origin is bottom-center)
            lampWidth,               // Width
            lampHeight               // Height
        );

        // Keep the border updated with the lamp's position
        lamp.graphics = graphics;
    }

    makeLampDraggable(lamp, floorPolygon) {
        lamp.setInteractive({ draggable: true });
        this.input.setDraggable(lamp);

        lamp.on('drag', (pointer, dragX, dragY) => {
            // Check if the new position is within the floor polygon
            if (Phaser.Geom.Polygon.Contains(floorPolygon, dragX, dragY)) {
                lamp.x = dragX;
                lamp.y = dragY;

                // Move the light with the lamp
                lamp.light.x = dragX;
                lamp.light.y = dragY - (lamp.displayHeight * lamp.scaleY) / 2;

                // Update the border position
                lamp.graphics.clear();
                lamp.graphics.lineStyle(2, 0xff0000, 0.8); // Red border
                lamp.graphics.strokeRect(
                    lamp.x - (lamp.displayWidth * lamp.scaleX) / 2,
                    lamp.y - lamp.displayHeight * lamp.scaleY,
                    lamp.displayWidth * lamp.scaleX,
                    lamp.displayHeight * lamp.scaleY
                );

                // Apply perspective scaling (optional)
                const scaleFactor = this.calculatePerspectiveScale(dragY, floorPolygon);
                lamp.setScale(scaleFactor);
            }
        });
    }

    calculatePerspectiveScale(y, floorPolygon) {
        const topY = floorPolygon.points[0].y;
        const bottomY = floorPolygon.points[2].y;
        const minScale = 0.54;
        const maxScale = 0.57;

        return Phaser.Math.Linear(minScale, maxScale, (y - topY) / (bottomY - topY));
    }

    changeScene() {
        this.scene.start('GameOver');
    }
}
