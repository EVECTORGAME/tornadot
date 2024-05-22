import { h } from 'preact';
import {
	PointLight,
	Vector3,
} from 'three';
import { useEffect, useState, useRef, useCallback } from 'preact-hooks';
import useKeyHook from '../hooks/useKeyHook.js';
import createStylesheet from '../modules/createStylesheet.js';
import BitmapText from '../components/BitmapText.js';
import createScene from '../modules/createScene.js';
import createChronos from '../modules/createChronos.js';
import createStaticCamera from '../entities/createStaticCamera.js';
import createBaseOfMilki from '../entities/createBaseOfMilki.js';
import createBaseOfWitch from '../entities/createBaseOfWitch.js';
import createDemoHolder from '../entities/createDemoHolder.js';
import createOceanFloor from '../entities/createOceanFloor.js';
import createPlayer from '../entities/createPlayer.js';
import createSmallPlant from '../entities/createSmallPlant.js';
import createLevelEnd from '../entities/createLevelEnd.js';
import MainMenuScreen from './MainMenuScreen.js';

const theme = createStylesheet('PlayNextScreen', {
	container: {
		position: 'fixed',
		inset: 0,
	},
	title: {
		position: 'absolute',
		left: '50%',
		bottom: '20%',
		tranform: 'translateX(-50%)',
	},
});

const NOOP = () => {};
const ITEMS = [
	[createBaseOfMilki, { x: 0, z: 0 }],
	[createBaseOfWitch, { x: 0, z: 0 }],
	[createPlayer, { onLevelEnded: NOOP }],
	[createSmallPlant, { x: 0, z: 0 }],
	// [createHugeRock,   { x: 0, z: 0, radius: 3 }],
	[createLevelEnd, { x: 0, z: 0 }],
];

export default function PlayNextScreen({ onClose }) {
	const holderRef = useRef();
	const sceneRef = useRef();
	const currentEntityRef = useRef();
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [showPauseMenu, setShowPauseMenu] = useState();

	useKeyHook('Escape', () => {
		const shouldBePaused = !showPauseMenu;

		setShowPauseMenu(shouldBePaused);
	}, []);

	useEffect(() => {
		const holder = createDemoHolder({ x: 0, z: 0 });
		const cameraEntity = createStaticCamera();
		const scene = createScene({
			camera: cameraEntity.camera,
			minimapElement: {
				appendChild() {
					// TODO show minimap sprite
				},
				removeChild() {},
			},
		});
		const oceanFloor = createOceanFloor({ playerEntity: holder });

		const light = new PointLight(0xffffff, 5, 30, 0);
		light.position.set(0, 2, 1);
		scene.addThreeObject(light);

		scene.addEntity(holder);
		scene.addEntity(cameraEntity);
		scene.addEntity(oceanFloor);
		scene.render();

		holderRef.current = holder;
		sceneRef.current = scene;

		const cameraPosition = new Vector3();
		const chronos = createChronos((deltaTimeSeconds) => {
			scene.entities.forEach((entity) => {
				const isEmptyEntitySlot = !entity;
				if (isEmptyEntitySlot) {
					return;
				}

				cameraEntity.camera.getWorldPosition(cameraPosition);
				entity.handleTimeUpdate?.(deltaTimeSeconds, {}, cameraPosition);
			});

			scene.render();
		}, {
			doInitialSyncCall: true,
			initialDelayMilliseconds: 0,
		});

		return () => {
			chronos.destroy();
			scene.destroy();
		};
	}, []);

	useEffect(() => {
		const [createEntity, args] = ITEMS[selectedIndex];
		const entity = createEntity(args);

		if (currentEntityRef.current) {
			sceneRef.current.removeEntityAdnItsReferencesentity(currentEntityRef.current);
		}

		sceneRef.current.addEntity(entity);
		currentEntityRef.current = entity;
	}, [selectedIndex]);

	useEffect(() => {
		function handleKey({ key }) {
			if (key === 'ArrowLeft') {
				if (selectedIndex >= 1) {
					setSelectedIndex(selectedIndex - 1);
				}
			} else if (key === 'ArrowRight') {
				const lastItemInde = ITEMS.length - 1;

				if (selectedIndex < lastItemInde) {
					setSelectedIndex(selectedIndex + 1);
				}
			} else if (key === 'Enter') {
				// items[activeIndex].onSelected();
			}
		}

		document.body.addEventListener('keyup', handleKey);

		return () => {
			document.body.removeEventListener('keyup', handleKey);
		};
	}, [selectedIndex]);

	const handleResume = useCallback(() => {
		setShowPauseMenu(false);
	}, []);

	if (showPauseMenu) {
		return h(MainMenuScreen, {
			title: 'DEMO',
			items: [
				{ label: 'resume', onSelected: handleResume },
				{ label: 'quit', onSelected: onClose },
			],
		});
	}

	return (
		h('div',
			{ className: theme.title },
			h(BitmapText, { text: 'NEXT LEVEL IS', upscale: 2 }),
		)
	);
}
