import { h } from 'preact';
// import classNames from 'clsx';
import { useEffect, useRef } from 'preact-hooks';
// import utilClamp from '../utils/utilClamp.js';
import utilCreateDefer from '../utils/utilCreateDefer.js';
// import usePersistent from '../hooks/usePersistent.js';
import createChronos from '../modules/createChronos.js';
import createStylesheet from '../modules/createStylesheet.js';
import createScene from '../modules/createScene.js';
import randomLevelGenerator from '../modules/randomLevelGenerator.js';
//
import createPlayer from '../entities/createPlayer.js';
//
import CountDisplay from '../components/CountDisplay.js';
//
import { CAMERA_POSITION_Z } from '../config.js';
import { NINETY_DEGREES_IN_RADIANS } from '../constants.js';

function createLevel(levelNumber, { keyboardIntegrator, onLevelEnded, onRefreshUi }) {
	const scene = createScene();
	const player = createPlayer({
		onLevelEnded() {
			chronos.destroy();
			onLevelEnded({ endedLevel: levelNumber });
		},
	});

	const levelRadius = 150 + (levelNumber * 50);

	scene.add(player);

	// scene.add(createHugeRock({ x: 15, y: 0, radius: 5 }))

	player.model.add(scene.camera);

	const { levelEnd } = randomLevelGenerator(scene, levelRadius);

	const chronos = createChronos((deltaTimeMilliseconds, timeMilliseconds) => {
		scene.entities.forEach((entity) => {
			if (entity === player) {
				const playerDistanceToLevelEnd = player.model.position.distanceTo(levelEnd.model.position);
				onRefreshUi({
					playerDistanceToLevelEnd,
					deltaTimeMilliseconds,
				});

				const {
					isLeftHolded,
					isRightHolded,
					isForwardHolded,
					isBackwardHolded,
					isStepLeftHolded,
					isStepRightHolded,
				} = keyboardIntegrator.current;

				const isMovingSide = isStepLeftHolded || isStepRightHolded;
				if (isMovingSide) {
					if (isStepLeftHolded) {
						scene.addPosionToObjectAtIndex(entity, deltaTimeMilliseconds * +0.01, NINETY_DEGREES_IN_RADIANS);
					} else if (isStepRightHolded) {
						scene.addPosionToObjectAtIndex(entity, deltaTimeMilliseconds * -0.01, NINETY_DEGREES_IN_RADIANS);
					}
				} else if (isForwardHolded) {
					scene.addPosionToObjectAtIndex(entity, deltaTimeMilliseconds * 0.01, 0);
				} else if (isBackwardHolded) {
					scene.addPosionToObjectAtIndex(entity, deltaTimeMilliseconds * -0.005, 0);
				}

				const isRotationPressed = isLeftHolded || isRightHolded;
				if (isLeftHolded && isRightHolded) {
					//
				} else if (isLeftHolded) {
					entity.model.rotation.y += (deltaTimeMilliseconds * +0.005);
				} else if (isRightHolded) {
					entity.model.rotation.y += (deltaTimeMilliseconds * -0.005);
				}
			} else {
				// move others
			}
		});

		// scene.camera.position.set(
		// 	player.model.position.x,
		// 	scene.camera.position.y,
		// 	player.model.position.z + CAMERA_POSITION_Z,
		// );

		scene.render();
	}, {
		doInitialSyncCall: true,
		initialDelayMilliseconds: 0,
	});

	return {
		destroy() {
			scene.destroy();
		},
	};
}

const theme = createStylesheet('MainMenu', {
	container: {
		'position': 'fixed',
		'inset': 0,
		'display': 'flex',
		'justify-content': 'center',
		'align-items': 'center',
		'flex-direction': 'column',
		// 'background-color': COLOR_DARK_BLUE,
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
});

export default function LevelScreen({ levelNumber, keyboardIntegrator, onLevelEnded }) {
	const distanceApiRef = useRef();
	const fpsApiRef = useRef();

	useEffect(() => {
		const scene = createLevel(levelNumber, {
			keyboardIntegrator,
			onRefreshUi({
				playerDistanceToLevelEnd,
				deltaTimeMilliseconds,
			}) {
				const playerDistanceToLevelEndRounded = Math.round(playerDistanceToLevelEnd);
				distanceApiRef.current.alternateToNumber(`${playerDistanceToLevelEndRounded}M`);

				const fps = Math.round(1000 / deltaTimeMilliseconds);
				fpsApiRef.current.alternateToNumber(`FPS ${fps}`);
			},
			onLevelEnded({ endedLevel }) {
				onLevelEnded(endedLevel);
			},
		});

		return () => {
			scene.destroy();
		};
	}, []);

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
				h('div',
					{ className: theme.topLeftCorner },
					h(CountDisplay, {
						charactersCount: 7,
						paddingCharacter: ' ',
						shouldAlignToRight: false,
						apiRef: fpsApiRef,
					}),
				),
			],
		)
	);
}
