import { Controller } from '@hotwired/stimulus';
import TomSelect from 'tom-select';

export default class extends Controller {
  public static targets: string[] = ['select'];

  declare readonly selectTarget: HTMLSelectElement;

  public connect() {
    new TomSelect(this.selectTarget, {
      valueField: 'value',
      labelField: 'label',
      searchField: ['label'],
      load: (query: string, callback) => {
        if (!query.length) return callback();

        fetch('/api/geocode?q=' + encodeURIComponent(query))
          .then((response: Response): Promise<any> => response.json())
          .then((json) => callback(json))
          .catch(() => callback());
      },
    });
  }
}
