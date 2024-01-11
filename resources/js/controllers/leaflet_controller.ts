import { Controller } from '@hotwired/stimulus';
import L, { Map, TileLayer, Marker, Icon } from 'leaflet';

import type { ValueDefinitionMap } from '@hotwired/stimulus/dist/types/core/value_properties';

export default class extends Controller {
	static targets: string[] = ['map'];
	static values: ValueDefinitionMap = {
		lat: Number,
		long: Number,
	};

	declare readonly mapTarget: HTMLElement;
	declare readonly latValue: number;
	declare readonly longValue: number;

	declare map: Map;
	declare tileLayer: TileLayer;
	declare eventMarkerIcon: Icon;
	declare eventLocationMarker: Marker;

	connect(): void {
		L.Icon.Default.mergeOptions({
			iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
			iconUrl: require('leaflet/dist/images/marker-icon.png'),
			shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
		});

		this.map = new Map(this.mapTarget);
		this.map.setView([this.latValue, this.longValue], 19);

		this.tileLayer = new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution:
				'&copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
		}).addTo(this.map);

		this.eventMarkerIcon = new Icon({
			iconUrl: '/avatar.png',
			iconSize: [32, 32],
		});

		this.eventLocationMarker = new Marker([this.latValue, this.longValue], {
			icon: this.eventMarkerIcon,
		})
			.bindPopup('Apéro')
			.addTo(this.map);

		document.addEventListener('mapReload', () => {
			this.map.invalidateSize();
		});
	}
}
