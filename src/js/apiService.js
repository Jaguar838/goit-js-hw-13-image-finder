const KEY = '21828776-3a3234db6b008ce4834511463';
const URL = 'https://pixabay.com/api/';
const TUNING = 'image_type=photo&orientation=horizontal';

export default class ApiService {
  constructor() {
    this.currentPage = 1;
    this.searchQuery = '';
    this.selectData = 'all';
  }

  async fetchContent() {
    const url = `${URL}?${TUNING}&q=${this.searchQuery}&image_type=${this.selectData}&page=${this.currentPage}&per_page=12&key=${KEY}`;
    const res = await fetch(url);
    const { hits } = await res.json();
    this.incrementPage();
    return hits;
  }

  // async fetchContent() {
  //     try {
  //         const queryFetch = await fetch(`${URL}?${TUNING}&q=${this.searchQuery}&page=${this.currentPage}&per_page=12&key=${KEY}`)
  //         const result = await queryFetch.json();
  //         return result;
  //     } catch {
  //         return alertBadQuery();
  //     }
  // }

  incrementPage() {
    this.currentPage += 1;
  }

  resetPage() {
    this.currentPage = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
