const ListStore = require('./stores/list');
const DraftStore = require('./stores/draft');
const ProductStore = require('./stores/product');

class InMemoryDatabase {
  constructor() {
    this.lists = new ListStore();
    this.drafts = new DraftStore();
	this.products = new ProductStore();
  }
}

module.exports = InMemoryDatabase;
