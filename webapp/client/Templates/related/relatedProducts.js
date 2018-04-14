import { relatedProd } from './related.json';

Template.relatedProducts.helpers({
    products: function () {
        return relatedProd;
    }
});
