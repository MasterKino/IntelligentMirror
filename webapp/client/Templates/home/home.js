import './home.css';

const opts = {
  mirrorClass: '.js-normalmirror',
  intelligentClass: '.js-intelligentmirror'
};

// Template.home
// Template.home.created = Home.onCreated;
Template.home.rendered = function() {
    // function showMirrorView() {
    // }
    //
    // function showIntelligentView() {
    // }

    // loadAdidasAnimation();
    //
    // this.find(opts.intelligentClass).addEventListener(
    //     'click',
    //     showIntelligentView
    // );
    // this.find(opts.mirrorClass).addEventListener('click', showMirrorView);
    console.log("--[Rendered]-----------");
};

Template.home.events = {
    'click .js-normalmirror'(event, instance) {
        FlowRouter.go('mirror');
    },
    'click .js-intelligentmirror'(event, instance) {
        FlowRouter.go('productDetail');
    }
}
