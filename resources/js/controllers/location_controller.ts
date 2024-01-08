import { Controller } from '@hotwired/stimulus';
import TomSelect from 'tom-select';

export default class extends Controller {
	public static targets: string[] = ['select'];

	declare readonly selectTarget: HTMLSelectElement;

	public connect() {
		new TomSelect(this.selectTarget, {
			valueField: 'freeformAddress',
			labelField: 'freeformAddress',
			searchField: ['freeformAddress'],
			maxItems: 1,
			closeAfterSelect: true,
			load: (query: string, callback) => {
				if (!query.length) return callback();

				fetch('/api/location?q=' + encodeURIComponent(query))
					.then((response: Response): Promise<any> => response.json())
					.then((json) => callback(json))
					.catch(() => callback());
			},
			render: {
				option: function (item, escape) {
					return `
            <div class="py-3 px-3 d-flex">
              <div>
                <div class="mb-1">
                  <span>
                    ${escape(item.freeformAddress)}
                  </span>
                  <span id="lat" class="hidden">${escape(item.coordinates[0])}</span>
                  <span id="long" class="hidden">${escape(item.coordinates[1])}</span>
                </div>
              </div>
            </div>
          `;
				},
				item: function (item, escape) {
					return `
            <div class="py-0 d-flex">
              <div>
                <div class="mb-1">
                  <span class="text-white">
                    ${escape(item.freeformAddress)}
                  </span>
                  <span id="lat" class="hidden">${escape(item.coordinates[0])}</span>
                  <span id="long" class="hidden">${escape(item.coordinates[1])}</span>
                </div>
              </div>
            </div>
          `;
				},
				no_results: function () {
					return `<div class="py-3 px-3 font-bold">Pas d'adresse trouvée</div>`;
				},
			},
		});
	}
}
