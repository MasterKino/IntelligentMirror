import Home from './assets/js/HomeFunctions';
import Intelligent from './assets/js/IntelligentFunctions';

// Template.home
import * as html2canvas from 'html2canvas';
console.log('html2canvas:', html2canvas);

// Template.home
// Template.home.created = Home.onCreated;
Template.home.rendered = Home.onRendered;
Template.home.events = Home.events;

// Template.productDetail
Template.productDetail.created = Intelligent.onCreated;
Template.productDetail.destroyed = Intelligent.onDestroyed;
Template.productDetail.rendered = Intelligent.onRendered;
Template.productDetail.helpers = Intelligent.helpers;
Template.productDetail.events = Intelligent.events;
