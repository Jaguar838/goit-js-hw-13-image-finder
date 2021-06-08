// https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=что_искать&page=номер_страницы&per_page=12&key=твой_ключ
import error from './pnotify'
// ==
const KEY = "21828776-3a3234db6b008ce4834511463";
const URL = 'https://pixabay.com/api/';
const TUNING = 'image_type=photo&orientation=horizontal';

export default class ApiService {
    constructor() {
        this.page = 1;
        this.searchQuery = '';


    };

    async requestOnUrl() {
        try {
            const mainIncvery = await fetch(`${URL}?${TUNING}&q=${this.searchQuery}&page=${this.page}&per_page=12&key=${KEY}`)
            const inquiry = await mainIncvery.json();
            this.increment();
            return inquiry;
        } catch {
            return error();
        }


    }

    increment() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1
    }

}