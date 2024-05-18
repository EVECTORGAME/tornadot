import { h } from 'preact';
import { useEffect, useRef, useState, useCallback } from 'preact-hooks';
import { Vector3, Matrix4, Euler } from 'three';
import useKeyHook from '../hooks/useKeyHook.js';
import useKeyboard from '../hooks/useKeyboard.js';
import createChronos from '../modules/createChronos.js';
import createStylesheet from '../modules/createStylesheet.js';
import createScene from '../modules/createScene.js';
import createKeyboardIntegrator from '../modules/createKeyboardIntegrator.js';
import randomLevelGenerator from '../modules/randomLevelGenerator.js';
import createPlayer from '../entities/createPlayer.js';
import createCamera from '../entities/createCamera.js';
import createOceanFloor from '../entities/createOceanFloor.js';
import createAndromalius from '../entities/createAndromalius.js';
import createAimer from '../entities/createAimer.js';
import CountDisplay from '../components/CountDisplay.js';
import { NINETY_DEGREES_IN_RADIANS } from '../constants.js';
import MainMenuScreen from './MainMenuScreen.js';

function createLevel(levelNumber, { minimapElement, onLevelEnded, onRefreshUi }) {
	const aimerEntity = createAimer({ });
	const playerEntity = createPlayer({
		aimerEntity,
		onLevelEnded() {
			chronos.destroy();
			onLevelEnded({ endedLevel: levelNumber });
		},
	});

	const cameraEntity = createCamera({
		aimerEntity,
		playerEntity,
	});

	const oceanFloor = createOceanFloor({ playerEntity });

	const scene = createScene({
		camera: cameraEntity.camera,
		minimapElement,
	});

	const levelRadius = 150 + (levelNumber * 50);

	scene.addEntity(playerEntity);
	scene.addEntity(cameraEntity);
	scene.addEntity(oceanFloor);
	scene.addEntity(aimerEntity);
	scene.addEntity(createAndromalius({ x: 5, z: 5 }));

	const { levelEnd } = randomLevelGenerator(scene, levelRadius);

	const keyboardIntegrator = createKeyboardIntegrator();

	const chronos = createChronos((deltaTimeSeconds) => {
		const entitesToAdd = [];
		const entitesToDestroy = [];

		scene.entities.forEach((entity) => {
			const isEmptyEntitySlot = !entity;
			if (isEmptyEntitySlot) {
				return;
			}

			const isItPlayer = entity === playerEntity;
			const {
				KeyW: isForwardHolded,
				KeyS: isBackwardHolded,
				KeyA: isStepLeftHolded,
				KeyD: isStepRightHolded,
			} = isItPlayer ? keyboardIntegrator.current : {};

			const isActionPressed = isItPlayer ? keyboardIntegrator.consumeIsPressed('Space') : false;
			const isThrowFlarePressed = isItPlayer ? keyboardIntegrator.consumeIsPressed('KeyF') : false;

			if (isItPlayer) {
				const playerDistanceToLevelEnd = playerEntity.model.position.distanceTo(levelEnd.model.position);
				onRefreshUi({
					playerDistanceToLevelEnd,
					deltaTimeSeconds,
					// TODO entities: [...entities]
				});
			}

			/* const isMovingSide = isStepLeftHolded || isStepRightHolded;
			if (isMovingSide) {
				if (isStepLeftHolded) {
					scene.addPosionToObjectAtIndex(entity, deltaTimeSeconds * +10, NINETY_DEGREES_IN_RADIANS);
				} else if (isStepRightHolded) {
					scene.addPosionToObjectAtIndex(entity, deltaTimeSeconds * -10, NINETY_DEGREES_IN_RADIANS);
				}
			} else if (isForwardHolded) {
				scene.addPosionToObjectAtIndex(entity, deltaTimeSeconds * 10, 0);
			} else if (isBackwardHolded) {
				scene.addPosionToObjectAtIndex(entity, deltaTimeSeconds * -5, 0);
			} */

			/* const isActionPressed = keyboardIntegrator.consumeIsPressed('Space');
			if (isActionPressed) {
				const rocket = createRocket({
					x: entity.model.position.x,
					z: entity.model.position.z,
					rotation: entity.model.rotation.y, // TODO reds to degreesm degrees to radds
					shooterEntity: entity,
				});

				entitesToAdd.push(rocket);
			} */

			const {
				shouldDestroy,
				moveForwardStep,
				moveSidesStep,
				rotationStep,
				entitiesToAddToScene,
			} = entity.handleTimeUpdate?.(deltaTimeSeconds, {
				isForwardHolded,
				isBackwardHolded,
				isStepLeftHolded,
				isStepRightHolded,
				isActionPressed,
				isThrowFlarePressed,
			}, cameraEntity.model.position) ?? {};
			if (moveForwardStep) {
				scene.addPosionToObjectAtIndex(entity, moveForwardStep, 0);
			}

			if (moveSidesStep) {
				scene.addPosionToObjectAtIndex(entity, moveSidesStep, NINETY_DEGREES_IN_RADIANS);
			}

			scene.refreshEntityPositionOnMinimap(entity);

			if (rotationStep) {
				entity.model.rotation.y += rotationStep;
			}

			if (shouldDestroy) {
				entitesToDestroy.push(entity);
			}

			if (entitiesToAddToScene?.length) {
				entitiesToAddToScene.forEach((entityToadd) => {
					entitesToAdd.push(entityToadd);
				});
			}
		});

		// scene.camera.position.set(
		// 	player.model.position.x,
		// 	scene.camera.position.y,
		// 	player.model.position.z + CAMERA_POSITION_Z,
		// );

		scene.render();

		entitesToDestroy.forEach((entity) => {
			scene.removeEntityAdnItsReferencesentity(entity);
		});
		entitesToAdd.forEach((entity) => {
			scene.addEntity(entity);
		});
	}, {
		doInitialSyncCall: true,
		initialDelayMilliseconds: 0,
	});

	return {
		destroy() {
			scene.destroy();
		},
		setIsRunning(shouldBeRunning) {
			chronos.setIsRunning(shouldBeRunning);
		},
	};
}

const theme = createStylesheet('LevelScreen', {
	container: {
		position: 'fixed',
		inset: 0,
		// 'display': 'flex',
		// 'justify-content': 'center',
		// 'align-items': 'center',
		// 'flex-direction': 'column',
		// // 'background-color': COLOR_DARK_BLUE,
	},
	distanceHolder: {
		position: 'absolute',
		top: '1em',
		left: '50%',
		transform: 'translateX(-50%) scale(2)',
	},
	topLeftCorner: {
		'position': 'absolute',
		'top': '1em',
		'left': '1em',
		'display': 'flex',
		'flex-direction': 'column',
		// transform: 'translateX(-50%)',
	},
	minimap: {
		position: 'relative',
		width: '800px',
		height: '800px',
		border: '1px solid orange',
	},
});

export default function LevelScreen({ levelNumber, onLevelEnded, onAbort, onReload }) {
	const [showPauseMenu, setShowPauseMenu] = useState();
	const levelRef = useRef();
	const minimapElementRef = useRef();

	// setIsRunning(shouldBeRunning) {
	const distanceApiRef = useRef();
	const fpsApiRef = useRef();

	useKeyHook('Escape', () => {
		const shouldBePaused = !showPauseMenu;

		levelRef.current.setIsRunning(!shouldBePaused);
		setShowPauseMenu(shouldBePaused);
	}, []);

	// const [menus, setMenus] = useState();
	/* const {
		showInventory,
		showMap,
		showRadarView,
		doRealod,
		isInvertMouse,
	} = */
	const keys = useKeyboard({
		toggles: { // press cuases toggle
			KeyE: 'showInventory',
			KeyM: 'showMap',
		},
		holdes: { // active untill holded
			KeyV: 'showRadarView',
		},
		presseds: {
			KeyR: 'doRealod',
		},
		persistents: { // causes refresh
			KeyI: 'isInvertMouse',
		},
	});

	console.log('>> keys', keys);

	useEffect(() => {
		const level = createLevel(levelNumber, {
			minimapElement: minimapElementRef.current,
			onRefreshUi({
				playerDistanceToLevelEnd,
				deltaTimeSeconds,
			}) {
				const playerDistanceToLevelEndRounded = Math.round(playerDistanceToLevelEnd);
				distanceApiRef.current.alternateToNumber(`${playerDistanceToLevelEndRounded}M`);

				const deltaTimeMilliseconds = deltaTimeSeconds * 1000;
				const fps = Math.round(1000 / deltaTimeMilliseconds);
				// fpsApiRef.current.alternateToNumber(`FPS ${fps}`);
			},
			onLevelEnded({ endedLevel }) {
				onLevelEnded(endedLevel);
			},
		});

		levelRef.current = level;

		return () => {
			level.destroy();
		};
	}, []);

	const handleResume = useCallback(() => {
		levelRef.current.setIsRunning(true);
		setShowPauseMenu(false);
	}, []);

	if (showPauseMenu) {
		return h(MainMenuScreen, {
			title: 'PAUSE MANU',
			showAsOverlay: true,
			items: [
				{ label: 'resume', onSelected: handleResume },
				{ label: 'restart', onSelected: onReload },
				{ label: 'back to main menu', onSelected: onAbort },
			],
		});
	}

	return (
		h('div',
			{ className: theme.container },
			[
				h(CountDisplay, {
					charactersCount: 4,
					paddingCharacter: '0',
					shouldAlignToRight: true,
					className: theme.distanceHolder,
					apiRef: distanceApiRef,
				}),
				h('div', {
					ref: minimapElementRef,
					className: theme.minimap,
				}),
				/* h('div',
					{ className: theme.topLeftCorner },
					h(CountDisplay, {
						charactersCount: 7,
						paddingCharacter: ' ',
						shouldAlignToRight: false,
						apiRef: fpsApiRef,
					}),
				), */
			],
		)
	);
}
