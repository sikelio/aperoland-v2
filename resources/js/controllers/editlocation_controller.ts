import { Controller } from '@hotwired/stimulus';

import TomSelect from 'tom-select';
import EventHelper from '../lib/EventHelper';
import RequestHandler from '../lib/RequestHandler';

import type { AxiosResponse } from 'axios';

export default class extends Controller {
  public static targets: string[] = ['select'];

	declare readonly selectTarget: HTMLSelectElement;

  async connect(): Promise<string | void> {
    const eventId = EventHelper.getEventIdByRegex();

    try {
      const response: AxiosResponse<any, any> = await RequestHandler.get(`/app/event/${eventId}/location`);

      return this.generate(response.data.address, response.data.lat, response.data.long)
    } catch (error: any) {
      return location.href = `/app/event/${eventId}`;
    }
  }

  private generate(address: string, lat: string, long: string): void {
    const initData = { freeformAddress: address, coordinates: [lat, long] };

    let select = new TomSelect(this.selectTarget, {
      items: [initData.freeformAddress],
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

    select.addOption(initData);
    select.addItem(initData.freeformAddress);
  }
}
