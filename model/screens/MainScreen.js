import { h } from 'preact';
import Chapter from '../components/Chapter.js';
import Subarea from '../components/Subarea.js';
import Person from '../components/Person.js';
import {
	RESOURCE_BERRY,
	RESOURCE_WINE,
} from '../data/RESOURCES.js';

export default function MainScreen() {
	return (
		h(Chapter, { number: 1 },
			h(Subarea,
				{
					name: 'village',
					resources: [
						RESOURCE_BERRY,
						RESOURCE_WINE,
					],
				},
				h(Person,
					{
						name: 'Pierwsza baba',
						quests: [],
					},
				),
			),
		)
	);
}
